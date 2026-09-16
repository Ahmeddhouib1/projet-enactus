package org.enactusensi.platform.dto.member;

public record AttendanceUpdateRequest(
        boolean present,
        String remark
) {
}
