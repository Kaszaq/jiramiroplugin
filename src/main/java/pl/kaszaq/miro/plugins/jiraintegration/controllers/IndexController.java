package pl.kaszaq.miro.plugins.jiraintegration.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Slf4j
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