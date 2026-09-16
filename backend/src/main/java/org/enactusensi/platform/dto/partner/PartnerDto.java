package org.enactusensi.platform.dto.partner;

import org.enactusensi.platform.entity.PartnerType;

public record PartnerDto(
        Long id,
        String name,
        String logo,
        String websiteUrl,
        String description,
        PartnerType partnerType,
        Integer displayOrder
) {
}
