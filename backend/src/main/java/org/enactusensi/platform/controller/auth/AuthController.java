package org.enactusensi.platform.controller.auth;

import jakarta.validation.Valid;
import org.enactusensi.platform.dto.auth.LoginRequest;
import org.enactusensi.platform.dto.auth.LoginResponse;
import org.enactusensi.platform.dto.auth.MeResponse;
import org.enactusensi.platform.security.AdminUserPrincipal;
import org.enactusensi.platform.service.AuthService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public MeResponse me(@AuthenticationPrincipal AdminUserPrincipal principal) {
        return new MeResponse(principal.getUsername(), principal.getAdminUser().getRole().name());
    }
}
