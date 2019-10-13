package pl.kaszaq.miro.plugins.jiraintegration;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.io.Serializable;
import java.util.Collection;
import java.util.Map;

public class AtlassianOAuth2User implements OAuth2User, Serializable {
    private final String sub;

    public AtlassianOAuth2User(String sub) {
        this.sub = sub;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return null;
    }

    @Override
    public String getName() {
        return sub;
    }
}
