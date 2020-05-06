package pl.kaszaq.miro.plugins.jiraintegration.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class AccessTokenController {


    @Autowired
    private OAuth2AuthorizedClientService authorizedClientService;

    @Autowired
    private OAuth2AuthorizedClientManager manager;


    @RequestMapping(method = RequestMethod.GET, value = "/getAccessToken")
    public String transitionIssueController(OAuth2AuthenticationToken authentication) {
        if (authentication == null) {
            return null;
        }


        OAuth2AuthorizedClient authorizedClient =
                this.authorizedClientService.loadAuthorizedClient(
                        authentication.getAuthorizedClientRegistrationId(),
                        authentication.getName());


        OAuth2AuthorizeRequest request = OAuth2AuthorizeRequest.withAuthorizedClient(authorizedClient).principal(authentication).build();
        try {
            authorizedClient = manager.authorize(request);
        } catch (RuntimeException ex){
            log.error("Got exception when authorizing/trying to refresh access token",  ex);
            return null;
        }

        OAuth2AccessToken accessToken = authorizedClient.getAccessToken();
        return accessToken.getTokenValue();
    }
}
