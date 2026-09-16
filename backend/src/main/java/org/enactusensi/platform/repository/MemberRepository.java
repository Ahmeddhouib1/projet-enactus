package org.enactusensi.platform.repository;

import java.util.List;
import org.enactusensi.platform.entity.Member;
import org.enactusensi.platform.entity.MemberDepartment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
    List<Member> findAllByOrderByFullNameAsc();

    List<Member> findAllByActiveTrueOrderByFullNameAsc();

    List<Member> findAllByProjects_IdOrderByFullNameAsc(Long projectId);

    List<Member> findAllByActiveTrueAndDepartmentOrderByFullNameAsc(MemberDepartment department);

    List<Member> findAllByActiveTrueAndProjects_IdOrderByFullNameAsc(Long projectId);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);
}
