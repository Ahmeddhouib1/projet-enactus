package org.enactusensi.platform.repository;

import java.util.List;
import org.enactusensi.platform.entity.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    List<TeamMember> findAllByActiveTrueOrderByDisplayOrderAsc();

    List<TeamMember> findAllByOrderByDisplayOrderAsc();
}
