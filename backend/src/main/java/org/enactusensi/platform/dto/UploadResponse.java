package org.enactusensi.platform.dto;

public record UploadResponse(
        String url,
        String originalFilename,
        long sizeBytes
) {
}
