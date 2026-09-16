package org.enactusensi.platform.dto.document;

import java.time.Instant;
import org.enactusensi.platform.entity.DocumentScope;
import org.enactusensi.platform.entity.ProjectPhase;

public record DocumentDto(
        Long id,
        String title,
        String fileUrl,
        DocumentScope scope,
        Long projectId,
        String projectName,
        ProjectPhase phase,
        String description,
        Instant createdAt,
        Instant updatedAt
) {
}
