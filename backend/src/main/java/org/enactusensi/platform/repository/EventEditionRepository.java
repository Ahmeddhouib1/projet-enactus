package org.enactusensi.platform.repository;

import java.util.List;
import org.enactusensi.platform.entity.EventEdition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventEditionRepository extends JpaRepository<EventEdition, Long> {
    List<EventEdition> findByEventIdOrderByYearDesc(Long eventId);
}
