package org.enactusensi.platform.config;

import java.nio.file.Path;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final UploadProperties uploadProperties;

    public WebConfig(UploadProperties uploadProperties) {
        this.uploadProperties = uploadProperties;
    }

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        Path uploadPath = Path.of(uploadProperties.getDir()).toAbsolutePath().normalize();
        String pattern = uploadProperties.getPublicBaseUrl().endsWith("/**")
                ? uploadProperties.getPublicBaseUrl()
                : uploadProperties.getPublicBaseUrl() + "/**";

        registry.addResourceHandler(pattern)
                .addResourceLocations("file:" + uploadPath + "/");
    }
}
