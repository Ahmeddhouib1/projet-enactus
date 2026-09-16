package org.enactusensi.platform.dto.event;

import jakarta.validation.constraints.NotBlank;

public record EventImageRequest(
        @NotBlank(message = "imageUrl is required") String imageUrl,
        String caption,
        Integer displayOrder
) {
}
