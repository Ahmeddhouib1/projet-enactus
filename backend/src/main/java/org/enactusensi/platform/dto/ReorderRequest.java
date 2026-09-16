package org.enactusensi.platform.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record ReorderRequest(
        @NotEmpty(message = "orderedIds must not be empty") List<Long> orderedIds
) {
}
