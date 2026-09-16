package org.enactusensi.platform.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "team_members", indexes = {
        @Index(name = "idx_team_member_display_order", columnList = "display_order")
})
public class TeamMember extends BaseAuditableEntity {

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String role;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    @Column(nullable = false)
    private boolean active = true;
}
