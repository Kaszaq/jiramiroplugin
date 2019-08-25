package pl.kaszaq.miro.plugins.jiraintegration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pl.kaszaq.howfastyouaregoing.storage.DefaultFileStorage;
import pl.kaszaq.howfastyouaregoing.storage.FileStorage;

@Configuration
public class ProjectConfiguration {

    @Value("${encryption.password:#{null}}")
    private String encryptionPassword;

    @Value("${jira.url}")
    private String jiraUrl;

    @Bean
    public JiraAuthenticationProvider provideJira() {
        return new JiraAuthenticationProvider(jiraUrl);
    }

    @Bean
    public FileStorage provideFileStorage() {
        if (encryptionPassword == null) {
            return new DefaultFileStorage();
        }
        return new EncryptedFileStorage(encryptionPassword);
    }
}
