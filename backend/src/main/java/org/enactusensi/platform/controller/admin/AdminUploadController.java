package org.enactusensi.platform.controller.admin;

import java.util.Set;
import org.enactusensi.platform.dto.UploadResponse;
import org.enactusensi.platform.exception.BadRequestException;
import org.enactusensi.platform.storage.StorageService;
import org.enactusensi.platform.storage.StoredFile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/upload")
public class AdminUploadController {

    private static final Set<String> ALLOWED_CATEGORIES =
            Set.of("team", "projects", "events", "partners", "documents", "misc");

    private final StorageService storageService;

    public AdminUploadController(StorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping
    public ResponseEntity<UploadResponse> upload(@RequestParam("file") MultipartFile file,
                                                   @RequestParam(name = "category", defaultValue = "misc") String category) {
        if (!ALLOWED_CATEGORIES.contains(category)) {
            throw new BadRequestException("Unsupported upload category: " + category);
        }
        StoredFile stored = storageService.store(file, category);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new UploadResponse(stored.url(), stored.originalFilename(), stored.sizeBytes()));
    }
}
