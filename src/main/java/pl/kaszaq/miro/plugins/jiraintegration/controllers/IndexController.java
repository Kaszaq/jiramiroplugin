package pl.kaszaq.miro.plugins.jiraintegration.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {

    @GetMapping("/")
    public String indexController() {
        return "index"; //view
    }
    @GetMapping("/install")
    public String installController() {
        return "install";
    }

    @GetMapping("/installComplete")
    public String installCompleteController() {
        return "authFinished"; //view
    }
}