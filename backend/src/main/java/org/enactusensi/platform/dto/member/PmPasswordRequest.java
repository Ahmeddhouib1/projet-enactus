package org.enactusensi.platform.dto.member;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PmPasswordRequest(
        @NotBlank(message = "password is required")
        @Size(min = 4, message = "password must be at least 4 characters")
        String password
) {
}
