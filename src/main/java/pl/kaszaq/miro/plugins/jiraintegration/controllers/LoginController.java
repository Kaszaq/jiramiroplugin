package pl.kaszaq.miro.plugins.jiraintegration.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class LoginController {


    @Autowired
    private ClientRegistrationRepository clientRegistrationRepository;
    @GetMapping("/oauth2/login")
    public String getLoginPage() {
        return "oauth_login";
    }

    @GetMapping("/oauth2/loginSuccess")
    public String getLoginSuccessPage() {
        return "oauth_login_success";
    }

    @GetMapping("/oauth2/loginFailure")
    public String getLoginFailurePage() {
        return "oauth_login_failure";
    }
}