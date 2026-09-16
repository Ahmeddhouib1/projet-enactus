package org.enactusensi.platform.repository;

import java.util.List;
import java.util.Optional;
import org.enactusensi.platform.entity.Project;
import org.enactusensi.platform.entity.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    List<Project> findAllByStatusNotOrderByDisplayOrderAsc(ProjectStatus status);

    List<Project> findAllByFeaturedTrueAndStatusNotOrderByDisplayOrderAsc(ProjectStatus status);

    List<Project> findAllByOrderByDisplayOrderAsc();

    long countByStatus(ProjectStatus status);
}
