package org.enactusensi.platform.dto.project;

public record ProjectImageDto(
        Long id,
        String imageUrl,
        String caption,
        Integer displayOrder
) {
}
