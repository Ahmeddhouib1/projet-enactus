package org.enactusensi.platform.dto.member;

import java.time.Instant;
import java.util.List;
import org.enactusensi.platform.entity.MemberDepartment;

public record MemberDto(
        Long id,
        String fullName,
        String email,
        String phone,
        String photoUrl,
        MemberDepartment department,
        String role,
        boolean active,
        boolean hasPmPassword,
        List<ProjectRef> projects,
        Instant createdAt,
        Instant updatedAt
) {
}
