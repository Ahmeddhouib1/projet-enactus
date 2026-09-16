package org.enactusensi.platform.repository;

import java.util.List;
import org.enactusensi.platform.entity.Document;
import org.enactusensi.platform.entity.DocumentScope;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByScopeOrderByCreatedAtDesc(DocumentScope scope);

    List<Document> findByProjectIdOrderByCreatedAtDesc(Long projectId);
}
