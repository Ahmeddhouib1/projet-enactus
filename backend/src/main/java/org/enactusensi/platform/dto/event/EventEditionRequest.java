package org.enactusensi.platform.dto.event;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record EventEditionRequest(
        @NotBlank(message = "editionName is required") String editionName,
        @NotNull(message = "year is required") Integer year,
        String description,
        LocalDate startDate,
        LocalDate endDate,
        String location,
        String coverImage,
        Integer displayOrder
) {
}
