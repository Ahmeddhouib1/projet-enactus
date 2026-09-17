package org.enactusensi.platform.storage;

import java.util.Set;
import org.enactusensi.platform.exception.BadRequestException;
import org.springframework.web.multipart.MultipartFile;

final class UploadValidator {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation");
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "jpg", "jpeg", "png", "webp", "gif", "svg",
            "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx");

    private UploadValidator() {
    }

    /**
     * Validates the file against size, content-type and extension rules and
     * returns its lower-cased extension.
     */
    static String validate(MultipartFile file, long maxSizeBytes) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("No file was provided.");
        }
        if (file.getSize() > maxSizeBytes) {
            throw new BadRequestException("File exceeds the maximum allowed size.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Unsupported file type: " + contentType);
        }

        String originalFilename = file.getOriginalFilename() == null ? "" : file.getOriginalFilename();
        String extension = extractExtension(originalFilename);
        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new BadRequestException("Unsupported file extension: " + extension);
        }
        return extension.toLowerCase();
    }

    private static String extractExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == filename.length() - 1) {
            throw new BadRequestException("File is missing a valid extension.");
        }
        return filename.substring(dotIndex + 1);
    }
}
