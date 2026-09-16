package org.enactusensi.platform.dto.document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.enactusensi.platform.entity.DocumentScope;
import org.enactusensi.platform.entity.ProjectPhase;

public record DocumentRequest(
        @NotBlank(message = "title is required") String title,
        @NotBlank(message = "fileUrl is required") String fileUrl,
        @NotNull(message = "scope is required") DocumentScope scope,
        Long projectId,
        ProjectPhase phase,
        String description
) {
}
