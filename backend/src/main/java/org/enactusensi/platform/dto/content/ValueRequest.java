package org.enactusensi.platform.dto.content;

import jakarta.validation.constraints.NotBlank;

public record ValueRequest(
        @NotBlank(message = "title is required") String title,
        String description,
        String icon,
        Integer displayOrder,
        boolean active
) {
}
