package org.enactusensi.platform.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Singleton row (id is always 1) holding the editorial CMS text shown on
 * the public Home/About pages.
 */
@Getter
@Setter
@Entity
@Table(name = "site_content")
public class SiteContent extends BaseAuditableEntity {

    @Column(name = "enactus_description", columnDefinition = "TEXT")
    private String enactusDescription;

    @Column(name = "enactus_ensi_description", columnDefinition = "TEXT")
    private String enactusEnsiDescription;

    @Column(columnDefinition = "TEXT")
    private String mission;

    @Column(columnDefinition = "TEXT")
    private String vision;

    @Column(name = "main_concept", columnDefinition = "TEXT")
    private String mainConcept;
}
