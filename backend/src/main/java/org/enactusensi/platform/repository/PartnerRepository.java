package org.enactusensi.platform.repository;

import java.util.List;
import org.enactusensi.platform.entity.Partner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartnerRepository extends JpaRepository<Partner, Long> {
    List<Partner> findAllByActiveTrueOrderByDisplayOrderAsc();

    List<Partner> findAllByOrderByDisplayOrderAsc();

    long countByActiveTrue();
}
