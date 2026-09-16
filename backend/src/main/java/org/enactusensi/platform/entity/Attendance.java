package org.enactusensi.platform.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

/**
 * One member's presence record (and admin remarks) for one activity -
 * the building block of each member's "presence sheet".
 */
@Getter
@Setter
@Entity
@Table(name = "attendances",
        indexes = {
                @Index(name = "idx_attendance_member", columnList = "member_id"),
                @Index(name = "idx_attendance_activity", columnList = "activity_id")
        },
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_attendance_member_activity", columnNames = {"member_id", "activity_id"})
        })
public class Attendance extends BaseAuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

    @Column(nullable = false)
    private boolean present = false;

    @Column(columnDefinition = "TEXT")
    private String remark;
}
