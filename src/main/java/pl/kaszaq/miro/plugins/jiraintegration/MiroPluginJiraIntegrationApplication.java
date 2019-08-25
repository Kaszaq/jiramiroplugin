package pl.kaszaq.miro.plugins.jiraintegration;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MiroPluginJiraIntegrationApplication {

	public static void main(String[] args) {
		SpringApplication.run(MiroPluginJiraIntegrationApplication.class, args);
	}
}
