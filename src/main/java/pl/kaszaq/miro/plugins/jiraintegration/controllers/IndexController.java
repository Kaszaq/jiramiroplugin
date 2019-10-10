package pl.kaszaq.miro.plugins.jiraintegration.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Slf4j
@Controller
public class IndexController {

    @Value("${miroClientId}")
    private String miroClientId;

    @GetMapping("/")
    public String indexController(Model model) {
        model.addAttribute("miroClientId", miroClientId);
        return "index"; //view
    }
}