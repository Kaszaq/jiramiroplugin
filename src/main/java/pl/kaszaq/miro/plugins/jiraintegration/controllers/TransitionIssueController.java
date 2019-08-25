package pl.kaszaq.miro.plugins.jiraintegration.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicHeader;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;
import pl.kaszaq.howfastyouaregoing.agile.AgileClient;
import pl.kaszaq.howfastyouaregoing.agile.AgileClientFactory;
import pl.kaszaq.howfastyouaregoing.agile.AgileProjectProvider;
import pl.kaszaq.howfastyouaregoing.agile.Issue;
import pl.kaszaq.howfastyouaregoing.agile.jira.JiraAgileProjectProviderBuilderFactory;
import pl.kaszaq.miro.plugins.jiraintegration.BasicAuthHeader;
import pl.kaszaq.miro.plugins.jiraintegration.NotFoundException;
import pl.kaszaq.howfastyouaregoing.storage.FileStorage;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.util.*;

import static pl.kaszaq.howfastyouaregoing.Config.OBJECT_MAPPER;

@RestController
@Slf4j
public class TransitionIssueController {

    @Autowired
    FileStorage fileStorage;
    @Autowired
    private BasicAuthHeader basicAuthHeader;
    @Value("${jira.url}")
    private String jiraUrl;
    @Value("${project.id}")
    private String projectId;
    @Value("${storage.dir}")
    private String storageDir;
    private File cacheDir;

    @Value("${jira.username}")
    private String jiraUserName;
    @Value("${jira.password}")
    private String jiraPassword;
    private volatile AgileClient agileClient;

    @PostConstruct
    public void setupCache() {
        System.out.println("Storage dir: " + storageDir);
        cacheDir = new File(storageDir);
        System.out.println("cache dir: " + cacheDir);

    }

    private synchronized AgileClient getAgileClient() {

        AgileClient localAgileClient = agileClient;
        if (localAgileClient == null) {
            AgileProjectProvider agileProjectProvider =
                    JiraAgileProjectProviderBuilderFactory
                            .withCredentials(jiraUserName, jiraPassword)
                            .withCacheDir(cacheDir)
                            .withFileStorage(fileStorage)
                            .withMinutesUntilUpdate(0)
                            .withJiraUrl(jiraUrl)
                            .withCacheRawJiraFiles(false)
                            .build();

            // configure client
            localAgileClient = AgileClientFactory.newClient()
                    .withAgileProjectProvider(agileProjectProvider)
                    .create();

            agileClient = localAgileClient;
        }
        return localAgileClient;
    }

    @CrossOrigin(origins = "*")
    @RequestMapping(method = RequestMethod.POST, value = "/transitionIssue")
    public String transitionIssueController(
            @RequestParam(value = "issueSummary") String issueSummary,
            @RequestParam(value = "transitionName") String transitionName
    ) throws IOException {
        // todo: this client shouldnt be loading with each request :| this should be changed asap to something with caching or whatever else
        // todo: agileClient won't be used shortly in this app so no need to to care about this now, agile.
        Optional<Issue> issueOptional = getAgileClient().getAgileProject(projectId).getAllIssues().stream().filter(i -> issueSummary.equals(i.getSummary())).findFirst();
        Issue issue = issueOptional.get();

// TODO: in future in should be based on issueKey not summary. Miro will expose keys of jira in the future
//        Optional<Issue> issueOptional = agileClient.getIssue(issueId);
//        Issue issue = issueOptional.get();

        // unless this app will handle more types of transitions we can block here transitions of statuses from the one in which given issue already is
        // to not create too many of them
        if (issue.getStatus().equals(transitionName)) {
            return "Already moved to this status";
        }
        ArrayList<BasicHeader> header = basicAuthHeader.get();
        Map<String, String> transitions = getTransitionsAvailableForUser(issue.getKey());
        String transitionId = transitions.get(transitionName);
        if (transitionId == null) {
            throw new NotFoundException("Requested transition not found for given issue");
        }
        try (CloseableHttpClient client = HttpClients.custom()
                .useSystemProperties()
                .setDefaultHeaders(header)
                .build()) {
            HttpPost httpPost = new HttpPost(jiraUrl + "/rest/api/3/issue/" + issue.getKey() + "/transitions");
            //   https://howfastyouaregoing.atlassian.net/rest/api/3/issue/TEST-1/transitions
            JsonNodeFactory jnf = JsonNodeFactory.instance;
            ObjectNode root = jnf.objectNode();
            ObjectNode transitionNode = root.putObject("transition");

            transitionNode.put("id", transitionId);

            String entity = OBJECT_MAPPER.writeValueAsString(root);

            log.info("Executing POST request {} with body {}", httpPost.getRequestLine(), entity);
            StringEntity requestEntity = new StringEntity(
                    entity,
                    ContentType.APPLICATION_JSON);
            httpPost.setEntity(requestEntity);
            String response;
            try (CloseableHttpResponse httpResponse = client.execute(httpPost)) {
                final int statusCode = httpResponse.getStatusLine().getStatusCode();
                if (statusCode == 404) {
                    throw new NotFoundException();
                }
                if (statusCode >= 300) {
                    throw new AccessDeniedException("Unable to verify your permissions in jira. Jira returned http status " + statusCode);
                }
                agileClient = null;
                if (httpResponse.getEntity() == null) {
                    response = "Done!";
                } else
                    response = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");

            }
            return response;
        }
    }

    private Map<String, String> getTransitionsAvailableForUser(String issueKey) {

        try (CloseableHttpClient client = HttpClients.custom()
                .useSystemProperties()
                .setDefaultHeaders(basicAuthHeader.get())
                .build()) {

            HttpGet httpGet = new HttpGet(jiraUrl + "/rest/api/3/issue/" + issueKey + "/transitions");
            try (CloseableHttpResponse response = client.execute(httpGet)) {
                final int statusCode = response.getStatusLine().getStatusCode();
                if (statusCode == 404) {
                    throw new NotFoundException();
                }
                if (statusCode != 200) {
                    throw new AccessDeniedException("Unable to verify your permissions in jira. Jira returned http status " + statusCode);
                }
                String responseValue = EntityUtils.toString(response.getEntity(), "UTF-8");


                Map<String, String> transitions = new HashMap<>();


                Iterator<JsonNode> it = OBJECT_MAPPER.readTree(responseValue).path("transitions").elements();
                while (it.hasNext()) {
                    JsonNode transition = it.next();
                    String id = transition.get("id").asText();
                    String name = transition.get("name").asText();
                    // as names are not unique [i think so, nothing is certain with Jira...] if there are more then two transitions with the same name they will be overwritten
                    // I dont care as project should be prepared in such a way that this would not happen. Unless one wishes to use ids...
                    transitions.put(name, id);
                }
                return transitions;
            }
        } catch (Exception ex) {
            log.error("Problem while closing? http client", ex);
            throw new RuntimeException(ex);
        }
    }
}
