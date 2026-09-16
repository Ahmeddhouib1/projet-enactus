package org.enactusensi.platform.repository;

import java.util.List;
import java.util.Optional;
import org.enactusensi.platform.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByActivityIdOrderByMember_FullNameAsc(Long activityId);

    List<Attendance> findByMemberIdOrderByActivity_ActivityDateDesc(Long memberId);

    Optional<Attendance> findByMemberIdAndActivityId(Long memberId, Long activityId);
}
