package org.enactusensi.platform.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import java.util.HashSet;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

/**
 * Internal club member roster used by the admin-only Member Space
 * (attendance tracking, project team assignment). Distinct from
 * {@link TeamMember}, which powers the public Team page.
 */
@Getter
@Setter
@Entity
@Table(name = "members", indexes = {
        @Index(name = "idx_member_email", columnList = "email", unique = true)
})
public class Member extends BaseAuditableEntity {

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    @Column(name = "photo_url")
    private String photoUrl;

    /** Nullable: not every role (Team Leader, RH, Project Manager...) belongs to Marketing or Sponsoring. */
    @Enumerated(EnumType.STRING)
    private MemberDepartment department;

    /** Free-text job title (e.g. "Project Manager") - optional, used to filter the Project Space's picker. */
    private String role;

    @Column(nullable = false)
    private boolean active = true;

    /**
     * BCrypt hash securing this member's personal Project Space (a
     * self-service unlock layered on top of the admin login, not a
     * replacement for it). Null until they set it on first use.
     */
    @Column(name = "pm_password_hash")
    private String pmPasswordHash;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "member_projects",
            joinColumns = @JoinColumn(name = "member_id"),
            inverseJoinColumns = @JoinColumn(name = "project_id")
    )
    private Set<Project> projects = new HashSet<>();
}
