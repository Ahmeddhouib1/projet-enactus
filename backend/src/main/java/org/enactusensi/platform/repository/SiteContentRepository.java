package org.enactusensi.platform.repository;

import org.enactusensi.platform.entity.SiteContent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteContentRepository extends JpaRepository<SiteContent, Long> {
}
