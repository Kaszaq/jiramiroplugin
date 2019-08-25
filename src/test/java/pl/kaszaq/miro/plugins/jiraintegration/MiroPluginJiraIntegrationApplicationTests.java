package pl.kaszaq.miro.plugins.jiraintegration;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(properties = "jira.url=")
public class MiroPluginJiraIntegrationApplicationTests {

	@Test
	public void contextLoads() {
	}

}
