package pl.kaszaq.miro.plugins.jiraintegration;

import com.nimbusds.jwt.JWT;
import com.nimbusds.jwt.JWTParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.header.writers.frameoptions.StaticAllowFromStrategy;
import org.springframework.security.web.header.writers.frameoptions.WhiteListedAllowFromStrategy;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;
import org.springframework.web.filter.CommonsRequestLoggingFilter;

import java.net.URI;
import java.text.ParseException;
import java.util.Arrays;
import java.util.Collection;
import java.util.Map;

@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {


    @Value("${security.enabled}")
    private Boolean enabled;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
//        if (enabled) {
//            http
//                    .authorizeRequests()
//                    //                .antMatchers("/", "/home").permitAll()
//                    .anyRequest().authenticated()
//                    .and()
//                    .formLogin()
//                    .loginPage("/login.html")
//                    .loginProcessingUrl("/login")
//                    .defaultSuccessUrl("/", true)
//                    .permitAll()
//                    .and()
//                    .logout()
//                    .permitAll();
//        }

        http.authorizeRequests()
                .anyRequest().authenticated()
                .and()
                .oauth2Login()
                .userInfoEndpoint().userService(userRequest -> {
            JWT token = null;
            String subject=null;
            try {
                token = JWTParser.parse(userRequest.getAccessToken().getTokenValue());
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
        });
        http.csrf().disable();
        //http.headers().frameOptions().disable();
        http.headers().addHeaderWriter(new XFrameOptionsHeaderWriter(new StaticAllowFromStrategy(new URI("https://miro.com/"))));
    }

    @Bean
    public CommonsRequestLoggingFilter requestLoggingFilter() {
        CommonsRequestLoggingFilter loggingFilter = new CommonsRequestLoggingFilter();
        loggingFilter.setIncludeClientInfo(false);
        loggingFilter.setIncludeQueryString(true);
        loggingFilter.setIncludePayload(false);
        loggingFilter.setIncludeHeaders(false);
        return loggingFilter;
    }
}
