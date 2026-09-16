package org.enactusensi.platform.dto.member;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record AttendanceBulkRequest(
        @NotEmpty(message = "entries must not be empty") @Valid List<AttendanceEntryRequest> entries
) {
}
