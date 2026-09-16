package org.enactusensi.platform.dto.event;

import java.time.Instant;
import java.util.List;

public record AdminEventResponse(
        Long id,
        String slug,
        String name,
        String description,
        String coverImage,
        boolean featured,
        List<EventEditionDto> editions,
        Instant createdAt,
        Instant updatedAt
) {
}
