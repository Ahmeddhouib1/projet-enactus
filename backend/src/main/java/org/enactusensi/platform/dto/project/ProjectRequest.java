package org.enactusensi.platform.dto.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import org.enactusensi.platform.entity.ProjectPhase;
import org.enactusensi.platform.entity.ProjectStatus;

public record ProjectRequest(
        @NotBlank(message = "name is required") String name,
        String shortDescription,
        String fullDescription,
        String context,
        String solution,
        String impact,
        String objectives,
        String coverImage,
        String logo,
        String category,
        @NotNull(message = "status is required") ProjectStatus status,
        @NotNull(message = "phase is required") ProjectPhase phase,
        LocalDate startDate,
        LocalDate endDate,
        boolean featured,
        Integer displayOrder
) {
}
