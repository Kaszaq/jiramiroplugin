package pl.kaszaq.miro.plugins.jiraintegration;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import org.apache.http.HttpHeaders;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

public class JiraAuthenticationProvider
        implements AuthenticationProvider {

    private final CloseableHttpClient httpClient = HttpClients.custom()
            .useSystemProperties()
            .build();
    private final String jiraUrl;

    JiraAuthenticationProvider(String jiraUrl) {
        this.jiraUrl = jiraUrl;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        String password = authentication.getCredentials().toString();

        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encode(
                auth.getBytes(StandardCharsets.ISO_8859_1));
        String authHeader = "Basic " + new String(encodedAuth);

        HttpGet get = new HttpGet(jiraUrl + "/rest/auth/1/session");
        get.setHeader(HttpHeaders.AUTHORIZATION, authHeader);

        String response;
        try (CloseableHttpResponse httpResponse = httpClient.execute(get)) {
            if (httpResponse.getStatusLine().getStatusCode() != 200) {
                throw new BadCredentialsException("Response code is " + httpResponse.getStatusLine().getStatusCode());
            }
            response = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
        } catch (IOException ex) {
            throw new AuthenticationException("Problematic connection to server.") {
            };
        }
        UsernamePasswordAuthenticationToken userAuthentication = new UsernamePasswordAuthenticationToken(username, password, new ArrayList<>());
        userAuthentication.setDetails(password);
//        userAuthentication.setAuthenticated(true);
        return userAuthentication;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(
                UsernamePasswordAuthenticationToken.class);
    }

}
