package org.enactusensi.platform.dto.partner;

import java.time.Instant;
import org.enactusensi.platform.entity.PartnerType;

public record AdminPartnerResponse(
        Long id,
        String name,
        String logo,
        String websiteUrl,
        String description,
        PartnerType partnerType,
        Integer displayOrder,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {
}
