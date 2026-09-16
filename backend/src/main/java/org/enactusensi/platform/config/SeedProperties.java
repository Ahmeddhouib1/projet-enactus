package org.enactusensi.platform.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.seed")
public class SeedProperties {
    private boolean enabled;
    private String adminEmail;
    private String adminPassword;
}
