package org.enactusensi.platform.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "event_images")
public class EventImage extends BaseAuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "edition_id", nullable = false)
    private EventEdition edition;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    private String caption;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;
}
