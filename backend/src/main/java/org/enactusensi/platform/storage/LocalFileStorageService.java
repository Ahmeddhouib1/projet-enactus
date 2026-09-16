package org.enactusensi.platform.storage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.enactusensi.platform.config.UploadProperties;
import org.enactusensi.platform.exception.BadRequestException;
import org.enactusensi.platform.exception.FileStorageException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class LocalFileStorageService implements StorageService {

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

    private final UploadProperties uploadProperties;

    public LocalFileStorageService(UploadProperties uploadProperties) {
        this.uploadProperties = uploadProperties;
    }

    @Override
    public StoredFile store(MultipartFile file, String subDirectory) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("No file was provided.");
        }
        if (file.getSize() > uploadProperties.getMaxSizeBytes()) {
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

        try {
            Path targetDir = Path.of(uploadProperties.getDir(), subDirectory).toAbsolutePath().normalize();
            Files.createDirectories(targetDir);

            String storedFilename = UUID.randomUUID() + "." + extension.toLowerCase();
            Path targetFile = targetDir.resolve(storedFilename);
            file.transferTo(targetFile);

            String baseUrl = uploadProperties.getPublicBaseUrl();
            String url = String.join("/", List.of(baseUrl, subDirectory, storedFilename))
                    .replace("//", "/")
                    .replaceFirst("^/", "/");
            return new StoredFile(url, originalFilename, file.getSize());
        } catch (IOException e) {
            throw new FileStorageException("Failed to store uploaded file.", e);
        }
    }

    @Override
    public void delete(String publicUrl) {
        if (publicUrl == null || publicUrl.isBlank()) {
            return;
        }
        String baseUrl = uploadProperties.getPublicBaseUrl();
        if (!publicUrl.startsWith(baseUrl)) {
            return;
        }
        String relative = publicUrl.substring(baseUrl.length()).replaceFirst("^/", "");
        Path target = Path.of(uploadProperties.getDir(), relative).toAbsolutePath().normalize();
        try {
            Files.deleteIfExists(target);
        } catch (IOException e) {
            throw new FileStorageException("Failed to delete file: " + publicUrl, e);
        }
    }

    private String extractExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == filename.length() - 1) {
            throw new BadRequestException("File is missing a valid extension.");
        }
        return filename.substring(dotIndex + 1);
    }
}
