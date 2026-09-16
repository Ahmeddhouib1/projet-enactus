package org.enactusensi.platform.storage;

import org.springframework.web.multipart.MultipartFile;

/**
 * Storage abstraction for uploaded media (team photos, project/event/partner
 * images). {@link LocalFileStorageService} is the default local-disk
 * implementation; a future S3/MinIO/Cloudinary implementation can be swapped
 * in without changing any caller.
 */
public interface StorageService {

    StoredFile store(MultipartFile file, String subDirectory);

    void delete(String publicUrl);
}
