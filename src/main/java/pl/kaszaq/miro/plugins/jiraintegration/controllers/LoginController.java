package pl.kaszaq.miro.plugins.jiraintegration.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ResolvableType;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.HashMap;
import java.util.Map;

@Controller
public class LoginController {


    @Autowired
    private ClientRegistrationRepository clientRegistrationRepository;
    @Value("${miroClientId}")
    private String miroClientId;
    @GetMapping("/oauth2/login")
    public String getLoginPage(Model model) {
        model.addAttribute("miroClientId", miroClientId);
        return "oauth_login";
    }

    @GetMapping("/oauth2/loginSuccess")
    public String getLoginSuccessPage() {
        return "oauth_login_success";
    }
}