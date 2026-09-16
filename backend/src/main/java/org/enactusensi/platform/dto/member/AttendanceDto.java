package org.enactusensi.platform.dto.member;

import java.time.LocalDate;

public record AttendanceDto(
        Long id,
        Long memberId,
        String memberFullName,
        Long activityId,
        String activityTitle,
        LocalDate activityDate,
        boolean present,
        String remark
) {
}
