package org.enactusensi.platform.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * A document (PDF/Word/Excel/PowerPoint) attached to a responsable's space:
 * either one project's document room, a department's (Marketing /
 * Sponsoring) shared space, or the general space shared by all responsables.
 */
@Getter
@Setter
@Entity
@Table(name = "documents", indexes = {
        @Index(name = "idx_document_scope", columnList = "scope"),
        @Index(name = "idx_document_project", columnList = "project_id")
})
public class Document extends BaseAuditableEntity {

    @Column(nullable = false)
    private String title;

    @Column(name = "file_url", nullable = false)
    private String fileUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentScope scope;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    /** Only meaningful when scope is PROJECT: which methodology stage this document belongs to. */
    @Enumerated(EnumType.STRING)
    private ProjectPhase phase;

    @Column(columnDefinition = "TEXT")
    private String description;
}
