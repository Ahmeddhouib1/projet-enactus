package org.enactusensi.platform.dto.project;

import org.enactusensi.platform.entity.ProjectStatus;

public record ProjectSummaryDto(
        Long id,
        String slug,
        String name,
        String shortDescription,
        String coverImage,
        String logo,
        String category,
        ProjectStatus status,
        boolean featured
) {
}
