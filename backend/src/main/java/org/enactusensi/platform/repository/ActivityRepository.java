package org.enactusensi.platform.repository;

import java.util.List;
import org.enactusensi.platform.entity.Activity;
import org.enactusensi.platform.entity.ActivityScope;
import org.enactusensi.platform.entity.MemberDepartment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findAllByOrderByActivityDateDesc();

    List<Activity> findAllByScopeTypeAndScopeDepartmentOrderByActivityDateDesc(
            ActivityScope scopeType, MemberDepartment scopeDepartment);
}
