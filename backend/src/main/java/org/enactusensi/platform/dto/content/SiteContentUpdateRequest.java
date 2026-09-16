package org.enactusensi.platform.dto.content;

import jakarta.validation.constraints.NotBlank;

public record SiteContentUpdateRequest(
        @NotBlank(message = "enactusDescription is required") String enactusDescription,
        @NotBlank(message = "enactusEnsiDescription is required") String enactusEnsiDescription,
        @NotBlank(message = "mission is required") String mission,
        @NotBlank(message = "vision is required") String vision,
        @NotBlank(message = "mainConcept is required") String mainConcept
) {
}
