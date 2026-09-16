package org.enactusensi.platform.security;

import org.enactusensi.platform.repository.AdminUserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AdminUserDetailsService implements UserDetailsService {

    private final AdminUserRepository adminUserRepository;

    public AdminUserDetailsService(AdminUserRepository adminUserRepository) {
        this.adminUserRepository = adminUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return adminUserRepository.findByEmailIgnoreCase(email)
                .map(AdminUserPrincipal::new)
                .orElseThrow(() -> new UsernameNotFoundException("No admin user found for email: " + email));
    }
}
