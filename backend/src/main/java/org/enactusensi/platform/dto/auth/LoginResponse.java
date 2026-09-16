package org.enactusensi.platform.dto.auth;

public record LoginResponse(
        String token,
        long expiresInMs,
        String email,
        String role
) {
}
