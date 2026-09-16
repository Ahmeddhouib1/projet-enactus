package org.enactusensi.platform.dto.member;

import java.time.Instant;
import java.time.LocalDate;
import org.enactusensi.platform.entity.ActivityScope;
import org.enactusensi.platform.entity.ActivityType;
import org.enactusensi.platform.entity.MemberDepartment;

public record ActivityDto(
        Long id,
        ActivityType type,
        String title,
        LocalDate activityDate,
        String description,
        ActivityScope scopeType,
        MemberDepartment scopeDepartment,
        ProjectRef scopeProject,
        Instant createdAt,
        Instant updatedAt
) {
}
