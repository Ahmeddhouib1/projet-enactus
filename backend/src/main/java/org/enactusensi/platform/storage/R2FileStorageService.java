package org.enactusensi.platform.storage;

import java.net.URI;
import java.util.List;
import java.util.UUID;
import org.enactusensi.platform.config.R2Properties;
import org.enactusensi.platform.config.UploadProperties;
import org.enactusensi.platform.exception.FileStorageException;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.http.urlconnection.UrlConnectionHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

/**
 * Stores uploaded files in a Cloudflare R2 bucket (S3-compatible), so files
 * survive backend restarts/redeploys on ephemeral hosting. Enabled with
 * {@code app.storage.provider=r2}.
 */
@Service
@ConditionalOnProperty(prefix = "app.storage", name = "provider", havingValue = "r2")
public class R2FileStorageService implements StorageService {

    private final R2Properties r2Properties;
    private final UploadProperties uploadProperties;
    private final S3Client s3Client;

    public R2FileStorageService(R2Properties r2Properties, UploadProperties uploadProperties) {
        this.r2Properties = r2Properties;
        this.uploadProperties = uploadProperties;
        this.s3Client = S3Client.builder()
                .endpointOverride(URI.create(
                        "https://" + r2Properties.getAccountId() + ".r2.cloudflarestorage.com"))
                .region(Region.of("auto"))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(r2Properties.getAccessKeyId(), r2Properties.getSecretAccessKey())))
                .httpClientBuilder(UrlConnectionHttpClient.builder())
                .build();
    }

    @Override
    public StoredFile store(MultipartFile file, String subDirectory) {
        String extension = UploadValidator.validate(file, uploadProperties.getMaxSizeBytes());
        String originalFilename = file.getOriginalFilename() == null ? "" : file.getOriginalFilename();

        String key = String.join("/", List.of(subDirectory, UUID.randomUUID() + "." + extension))
                .replace("//", "/")
                .replaceFirst("^/", "");

        try {
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(r2Properties.getBucket())
                            .key(key)
                            .contentType(file.getContentType())
                            .build(),
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        } catch (Exception e) {
            throw new FileStorageException("Failed to store uploaded file.", e);
        }

        String url = r2Properties.getPublicBaseUrl().replaceFirst("/$", "") + "/" + key;
        return new StoredFile(url, originalFilename, file.getSize());
    }

    @Override
    public void delete(String publicUrl) {
        if (publicUrl == null || publicUrl.isBlank()) {
            return;
        }
        String baseUrl = r2Properties.getPublicBaseUrl().replaceFirst("/$", "");
        if (!publicUrl.startsWith(baseUrl)) {
            return;
        }
        String key = publicUrl.substring(baseUrl.length()).replaceFirst("^/", "");
        try {
            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(r2Properties.getBucket())
                    .key(key)
                    .build());
        } catch (S3Exception e) {
            throw new FileStorageException("Failed to delete file: " + publicUrl, e);
        }
    }
}
