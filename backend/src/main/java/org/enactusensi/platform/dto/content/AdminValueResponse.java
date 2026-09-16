package org.enactusensi.platform.dto.content;

import java.time.Instant;

public record AdminValueResponse(
        Long id,
        String title,
        String description,
        String icon,
        Integer displayOrder,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {
}
