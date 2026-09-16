package org.enactusensi.platform.dto.project;

import jakarta.validation.constraints.NotBlank;

public record ProjectImageRequest(
        @NotBlank(message = "imageUrl is required") String imageUrl,
        String caption,
        Integer displayOrder
) {
}
