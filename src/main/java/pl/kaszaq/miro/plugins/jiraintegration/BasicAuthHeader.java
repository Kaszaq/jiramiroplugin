package pl.kaszaq.miro.plugins.jiraintegration;

import com.google.common.collect.Lists;
import org.apache.http.message.BasicHeader;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.Optional;

@Service
public class BasicAuthHeader {
    @Value("${jira.username:#{null}}")
    private String jiraUserName;
    @Value("${jira.password:#{null}}")
    private String jiraPassword;

     public ArrayList<BasicHeader> get() {
         ArrayList<BasicHeader> header;
         if (jiraUserName != null && jiraPassword != null) {
             final String username = jiraUserName;
             final String password = jiraPassword;
             header = create(username, password);
         } else {
             header =  create(
                     (String) Optional.ofNullable(SecurityContextHolder.getContext())
                             .map(SecurityContext::getAuthentication)
                             .filter(a -> a.getClass().equals(UsernamePasswordAuthenticationToken.class))
                             .map(Authentication::getPrincipal).orElse(null),
                     (String) Optional.ofNullable(SecurityContextHolder.getContext())
                             .map(SecurityContext::getAuthentication)
                             .filter(a -> a.getClass().equals(UsernamePasswordAuthenticationToken.class))
                             .map(Authentication::getDetails).orElse(null));
         }
         return header;
    }

    private ArrayList<BasicHeader> create(final String username, final String password) {
        ArrayList<BasicHeader> header;
        String encoding = Base64.getEncoder().encodeToString((username + ":" + password).getBytes());
        header = Lists.newArrayList(
                new BasicHeader("Authorization", "Basic " + encoding));
        return header;
    }
}
