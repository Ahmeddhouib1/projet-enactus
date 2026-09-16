package org.enactusensi.platform.dto.member;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import org.enactusensi.platform.entity.ActivityScope;
import org.enactusensi.platform.entity.ActivityType;
import org.enactusensi.platform.entity.MemberDepartment;

public record ActivityRequest(
        @NotNull(message = "type is required") ActivityType type,
        @NotBlank(message = "title is required") String title,
        @NotNull(message = "activityDate is required") LocalDate activityDate,
        String description,
        @NotNull(message = "scopeType is required") ActivityScope scopeType,
        MemberDepartment scopeDepartment,
        Long scopeProjectId
) {
}
