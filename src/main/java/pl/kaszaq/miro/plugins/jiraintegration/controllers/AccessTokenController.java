package pl.kaszaq.miro.plugins.jiraintegration.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
public class AccessTokenController {


    @Autowired
    private OAuth2AuthorizedClientService authorizedClientService;

//    @CrossOrigin(origins = "*")
    @RequestMapping(method = RequestMethod.GET, value = "/getAccessToken")
    public String transitionIssueController(OAuth2AuthenticationToken authentication) {
        if (authentication == null) {
            return null;
        }
        OAuth2AuthorizedClient authorizedClient =
                this.authorizedClientService.loadAuthorizedClient(
                        authentication.getAuthorizedClientRegistrationId(),
                        authentication.getName());

        OAuth2AccessToken accessToken = authorizedClient.getAccessToken();
        return accessToken.getTokenValue();
    }
}
