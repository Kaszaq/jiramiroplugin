package pl.kaszaq.miro.plugins.jiraintegration;

import com.nimbusds.jwt.JWT;
import com.nimbusds.jwt.JWTParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private ClientRegistrationRepository clientRegistrationRepository;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .oauth2Login(oauth2Login ->
                        oauth2Login
                                .authorizationEndpoint(authorizationEndpoint ->
                                        authorizationEndpoint
                                                .authorizationRequestResolver(
                                                        new CustomAuthorizationRequestResolver(
                                                                this.clientRegistrationRepository))
                                )

                                .defaultSuccessUrl("/oauth2/loginSuccess", true)
                                .failureUrl("/oauth2/loginFailure")
                                .loginPage("/oauth2/login")
                                .userInfoEndpoint().userService(userRequest -> {
                            String subject = null;
                            try {
                                JWT token = JWTParser.parse(userRequest.getAccessToken().getTokenValue());
                                subject = token.getJWTClaimsSet().getSubject();
                            } catch (ParseException e) {
                                e.printStackTrace();
                            }
                            String sub = subject;

                            return new OAuth2User() {
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
                            };
                        })
                );
        http.csrf().disable();
        http.headers().contentSecurityPolicy("frame-ancestors miro.com 'self';");
        http.headers().frameOptions().disable();
    }
}

@Slf4j
class CustomAuthorizationRequestResolver implements OAuth2AuthorizationRequestResolver {
    private final OAuth2AuthorizationRequestResolver defaultAuthorizationRequestResolver;

    public CustomAuthorizationRequestResolver(
            ClientRegistrationRepository clientRegistrationRepository) {

        this.defaultAuthorizationRequestResolver =
                new DefaultOAuth2AuthorizationRequestResolver(
                        clientRegistrationRepository, "/oauth2/authorization");
    }

    @Override
    public OAuth2AuthorizationRequest resolve(HttpServletRequest request) {
        OAuth2AuthorizationRequest authorizationRequest =
                this.defaultAuthorizationRequestResolver.resolve(request);

        return authorizationRequest != null ?
                customAuthorizationRequest(request, authorizationRequest) :
                null;
    }

    @Override
    public OAuth2AuthorizationRequest resolve(
            HttpServletRequest request, String clientRegistrationId) {
        OAuth2AuthorizationRequest authorizationRequest =
                this.defaultAuthorizationRequestResolver.resolve(
                        request, clientRegistrationId);

        return authorizationRequest != null ?
                customAuthorizationRequest(request, authorizationRequest) :
                null;
    }

    private OAuth2AuthorizationRequest customAuthorizationRequest(
            HttpServletRequest request, OAuth2AuthorizationRequest authorizationRequest) {
        boolean prompt = request.getParameterMap().containsKey("none") || request.getParameterMap().containsKey("consent");
        if(!prompt){
            return authorizationRequest;
        }
        Map<String, Object> additionalParameters =
                new LinkedHashMap<>(authorizationRequest.getAdditionalParameters());
        String promptVal = "none";
        if (request.getParameterMap().containsKey("consent")){
            promptVal="consent";
        }
        additionalParameters.put("prompt",promptVal);

        return OAuth2AuthorizationRequest.from(authorizationRequest)
                .additionalParameters(additionalParameters)
                .build();
    }
}
