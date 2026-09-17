package org.enactusensi.platform.storage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.enactusensi.platform.config.UploadProperties;
import org.enactusensi.platform.exception.FileStorageException;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@ConditionalOnProperty(prefix = "app.storage", name = "provider", havingValue = "local", matchIfMissing = true)
public class LocalFileStorageService implements StorageService {

    private final UploadProperties uploadProperties;

    public LocalFileStorageService(UploadProperties uploadProperties) {
        this.uploadProperties = uploadProperties;
    }

    @Override
    public StoredFile store(MultipartFile file, String subDirectory) {
        String extension = UploadValidator.validate(file, uploadProperties.getMaxSizeBytes());
        String originalFilename = file.getOriginalFilename() == null ? "" : file.getOriginalFilename();

        try {
            Path targetDir = Path.of(uploadProperties.getDir(), subDirectory).toAbsolutePath().normalize();
            Files.createDirectories(targetDir);

            String storedFilename = java.util.UUID.randomUUID() + "." + extension;
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
}
