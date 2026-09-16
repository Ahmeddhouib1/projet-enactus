package org.enactusensi.platform.config;

import org.enactusensi.platform.entity.AdminRole;
import org.enactusensi.platform.entity.AdminUser;
import org.enactusensi.platform.repository.AdminUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Creates the initial admin account from ADMIN_EMAIL / ADMIN_PASSWORD
 * environment variables on startup. Idempotent: does nothing if an account
 * with that email already exists. Never stores or logs a plaintext password.
 */
@Component
public class AdminUserSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminUserSeeder.class);

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final SeedProperties seedProperties;

    public AdminUserSeeder(AdminUserRepository adminUserRepository,
                            PasswordEncoder passwordEncoder,
                            SeedProperties seedProperties) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.seedProperties = seedProperties;
    }

    @Override
    public void run(String... args) {
        if (!seedProperties.isEnabled()) {
            return;
        }
        String email = seedProperties.getAdminEmail();
        String password = seedProperties.getAdminPassword();

        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            log.warn("ADMIN_EMAIL / ADMIN_PASSWORD are not set - skipping initial admin account creation.");
            return;
        }

        if (adminUserRepository.existsByEmailIgnoreCase(email)) {
            return;
        }

        AdminUser adminUser = new AdminUser();
        adminUser.setEmail(email.trim().toLowerCase());
        adminUser.setPasswordHash(passwordEncoder.encode(password));
        adminUser.setRole(AdminRole.ROLE_ADMIN);
        adminUserRepository.save(adminUser);

        log.info("Initial admin account created for {}", adminUser.getEmail());
    }
}
