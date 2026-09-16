package org.enactusensi.platform.repository;

import java.util.List;
import org.enactusensi.platform.entity.EventImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventImageRepository extends JpaRepository<EventImage, Long> {
    List<EventImage> findByEditionIdOrderByDisplayOrderAsc(Long editionId);
}
