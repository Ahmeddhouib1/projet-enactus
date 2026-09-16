package org.enactusensi.platform.repository;

import java.util.List;
import org.enactusensi.platform.entity.ProjectImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectImageRepository extends JpaRepository<ProjectImage, Long> {
    List<ProjectImage> findByProjectIdOrderByDisplayOrderAsc(Long projectId);
}
