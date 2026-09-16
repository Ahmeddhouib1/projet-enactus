package org.enactusensi.platform.dto.content;

public record ValueDto(
        Long id,
        String title,
        String description,
        String icon,
        Integer displayOrder
) {
}
