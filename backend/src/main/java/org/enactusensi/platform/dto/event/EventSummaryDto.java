package org.enactusensi.platform.dto.event;

import java.util.List;

public record EventSummaryDto(
        Long id,
        String slug,
        String name,
        String description,
        String coverImage,
        boolean featured,
        List<EventEditionDto> editions
) {
}
