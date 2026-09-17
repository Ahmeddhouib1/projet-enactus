package org.enactusensi.platform.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.storage.r2")
public class R2Properties {
    private String accountId;
    private String accessKeyId;
    private String secretAccessKey;
    private String bucket;
    private String publicBaseUrl;
}
