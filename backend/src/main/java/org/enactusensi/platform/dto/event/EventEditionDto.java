package org.enactusensi.platform.dto.event;

import java.time.LocalDate;
import java.util.List;

public record EventEditionDto(
        Long id,
        String editionName,
        Integer year,
        String description,
        LocalDate startDate,
        LocalDate endDate,
        String location,
        String coverImage,
        Integer displayOrder,
        List<EventImageDto> images
) {
}
