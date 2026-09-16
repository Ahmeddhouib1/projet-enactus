package org.enactusensi.platform.repository;

import java.util.List;
import org.enactusensi.platform.entity.Value;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ValueRepository extends JpaRepository<Value, Long> {
    List<Value> findAllByActiveTrueOrderByDisplayOrderAsc();

    List<Value> findAllByOrderByDisplayOrderAsc();
}
