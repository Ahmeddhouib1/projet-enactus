package org.enactusensi.platform.config;

import java.nio.file.Path;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final UploadProperties uploadProperties;
    private final String storageProvider;

    public WebConfig(UploadProperties uploadProperties, @Value("${app.storage.provider:local}") String storageProvider) {
        this.uploadProperties = uploadProperties;
        this.storageProvider = storageProvider;
    }

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        if (!"local".equals(storageProvider)) {
            return;
        }
        Path uploadPath = Path.of(uploadProperties.getDir()).toAbsolutePath().normalize();
        String pattern = uploadProperties.getPublicBaseUrl().endsWith("/**")
                ? uploadProperties.getPublicBaseUrl()
                : uploadProperties.getPublicBaseUrl() + "/**";

        registry.addResourceHandler(pattern)
                .addResourceLocations("file:" + uploadPath + "/");
    }
}
