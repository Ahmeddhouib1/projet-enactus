package org.enactusensi.platform.dto.team;

public record TeamMemberDto(
        Long id,
        String fullName,
        String role,
        String photoUrl,
        Integer displayOrder
) {
}
