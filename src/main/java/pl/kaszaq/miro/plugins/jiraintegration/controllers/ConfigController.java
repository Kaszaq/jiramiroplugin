package pl.kaszaq.miro.plugins.jiraintegration.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Slf4j
@Controller
public class ConfigController {

    @Value("${miroClientId}")
    private String miroClientId;

    @GetMapping("/config")
    public String indexController(Model model) {
        model.addAttribute("miroClientId", miroClientId);
        return "config"; //view
    }
}