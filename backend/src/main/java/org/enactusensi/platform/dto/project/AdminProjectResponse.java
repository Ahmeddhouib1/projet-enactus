package org.enactusensi.platform.dto.project;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import org.enactusensi.platform.entity.ProjectPhase;
import org.enactusensi.platform.entity.ProjectStatus;

public record AdminProjectResponse(
        Long id,
        String slug,
        String name,
        String shortDescription,
        String fullDescription,
        String context,
        String solution,
        String impact,
        String objectives,
        String coverImage,
        String logo,
        String category,
        ProjectStatus status,
        ProjectPhase phase,
        LocalDate startDate,
        LocalDate endDate,
        boolean featured,
        Integer displayOrder,
        List<ProjectImageDto> images,
        Instant createdAt,
        Instant updatedAt
) {
}
