package org.enactusensi.platform.dto.event;

import jakarta.validation.constraints.NotBlank;

public record EventRequest(
        @NotBlank(message = "name is required") String name,
        String description,
        String coverImage,
        boolean featured
) {
}
