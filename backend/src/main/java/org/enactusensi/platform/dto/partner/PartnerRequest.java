package org.enactusensi.platform.dto.partner;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.enactusensi.platform.entity.PartnerType;

public record PartnerRequest(
        @NotBlank(message = "name is required") String name,
        @NotBlank(message = "logo is required") String logo,
        String websiteUrl,
        String description,
        @NotNull(message = "partnerType is required") PartnerType partnerType,
        Integer displayOrder,
        boolean active
) {
}
