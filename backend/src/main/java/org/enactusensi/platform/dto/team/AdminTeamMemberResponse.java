package org.enactusensi.platform.dto.team;

import java.time.Instant;

public record AdminTeamMemberResponse(
        Long id,
        String fullName,
        String role,
        String photoUrl,
        Integer displayOrder,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {
}
