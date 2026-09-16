package org.enactusensi.platform.service;

import org.enactusensi.platform.config.JwtProperties;
import org.enactusensi.platform.dto.auth.LoginRequest;
import org.enactusensi.platform.dto.auth.LoginResponse;
import org.enactusensi.platform.security.AdminUserPrincipal;
import org.enactusensi.platform.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;

    public AuthService(AuthenticationManager authenticationManager, JwtService jwtService, JwtProperties jwtProperties) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.jwtProperties = jwtProperties;
    }

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().trim().toLowerCase(), request.password()));

        AdminUserPrincipal principal = (AdminUserPrincipal) authentication.getPrincipal();
        String role = principal.getAdminUser().getRole().name();
        String token = jwtService.generateToken(principal.getUsername(), role);

        return new LoginResponse(token, jwtProperties.getExpirationMs(), principal.getUsername(), role);
    }
}
