package pl.kaszaq.miro.plugins.jiraintegration.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ConfigController {


    @GetMapping("/config")
    public String indexController() {
        return "config";
    }
}