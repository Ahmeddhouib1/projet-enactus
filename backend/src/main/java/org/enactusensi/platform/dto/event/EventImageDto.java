package org.enactusensi.platform.dto.event;

public record EventImageDto(
        Long id,
        String imageUrl,
        String caption,
        Integer displayOrder
) {
}
