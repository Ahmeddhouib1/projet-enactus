package org.enactusensi.platform.security;

import java.util.Collection;
import java.util.List;
import org.enactusensi.platform.entity.AdminUser;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class AdminUserPrincipal implements UserDetails {

    private final AdminUser adminUser;

    public AdminUserPrincipal(AdminUser adminUser) {
        this.adminUser = adminUser;
    }

    public AdminUser getAdminUser() {
        return adminUser;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(adminUser.getRole().name()));
    }

    @Override
    public String getPassword() {
        return adminUser.getPasswordHash();
    }

    @Override
    public String getUsername() {
        return adminUser.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
