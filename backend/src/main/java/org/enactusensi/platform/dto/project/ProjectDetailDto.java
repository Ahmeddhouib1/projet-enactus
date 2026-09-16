package org.enactusensi.platform.dto.project;

import java.time.LocalDate;
import java.util.List;
import org.enactusensi.platform.entity.ProjectStatus;

public record ProjectDetailDto(
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
        LocalDate startDate,
        LocalDate endDate,
        boolean featured,
        List<ProjectImageDto> images
) {
}
