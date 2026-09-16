package org.enactusensi.platform.storage;

public record StoredFile(String url, String originalFilename, long sizeBytes) {
}
