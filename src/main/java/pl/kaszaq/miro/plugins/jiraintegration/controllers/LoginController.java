package pl.kaszaq.miro.plugins.jiraintegration.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class LoginController {


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