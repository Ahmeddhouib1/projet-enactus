package org.enactusensi.platform.dto.auth;

public record MeResponse(
        String email,
        String role
) {
}
