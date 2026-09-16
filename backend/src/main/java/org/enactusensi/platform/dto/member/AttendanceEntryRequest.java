package org.enactusensi.platform.dto.member;

import jakarta.validation.constraints.NotNull;

public record AttendanceEntryRequest(
        @NotNull(message = "memberId is required") Long memberId,
        boolean present,
        String remark
) {
}
