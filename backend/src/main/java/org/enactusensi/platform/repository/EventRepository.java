package org.enactusensi.platform.repository;

import java.util.List;
import java.util.Optional;
import org.enactusensi.platform.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<Event> findBySlug(String slug);

    boolean existsBySlug(String slug);

    List<Event> findAllByOrderByCreatedAtDesc();
}
