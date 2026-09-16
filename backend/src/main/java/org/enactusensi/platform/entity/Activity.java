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
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

/**
 * A formation, workshop or meeting ("reunion") that members attend.
 * Attendance is tracked per member via {@link Attendance}. Each activity
 * targets an audience: everyone, one department, or one project's team -
 * this determines which members show up when taking attendance.
 */
@Getter
@Setter
@Entity
@Table(name = "activities", indexes = {
        @Index(name = "idx_activity_date", columnList = "activity_date")
})
public class Activity extends BaseAuditableEntity {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActivityType type;

    @Column(nullable = false)
    private String title;

    @Column(name = "activity_date", nullable = false)
    private LocalDate activityDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "scope_type", nullable = false)
    private ActivityScope scopeType = ActivityScope.ALL;

    @Enumerated(EnumType.STRING)
    @Column(name = "scope_department")
    private MemberDepartment scopeDepartment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scope_project_id")
    private Project scopeProject;
}
