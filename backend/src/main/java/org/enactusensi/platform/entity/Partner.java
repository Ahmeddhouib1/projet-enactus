package org.enactusensi.platform.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "partners", indexes = {
        @Index(name = "idx_partner_display_order", columnList = "display_order")
})
public class Partner extends BaseAuditableEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String logo;

    @Column(name = "website_url")
    private String websiteUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "partner_type", nullable = false)
    private PartnerType partnerType = PartnerType.OTHER;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    @Column(nullable = false)
    private boolean active = true;
}
