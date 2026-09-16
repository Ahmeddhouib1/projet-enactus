package org.enactusensi.platform.dto.team;

import jakarta.validation.constraints.NotBlank;

public record TeamMemberRequest(
        @NotBlank(message = "fullName is required") String fullName,
        @NotBlank(message = "role is required") String role,
        String photoUrl,
        Integer displayOrder,
        boolean active
) {
}
