package org.enactusensi.platform.repository;

import java.util.Optional;
import org.enactusensi.platform.entity.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {
    Optional<AdminUser> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);
}
