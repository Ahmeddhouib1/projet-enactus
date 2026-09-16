package org.enactusensi.platform.controller.admin;

import jakarta.validation.Valid;
import java.util.List;
import org.enactusensi.platform.dto.ReorderRequest;
import org.enactusensi.platform.dto.project.AdminProjectResponse;
import org.enactusensi.platform.dto.project.ProjectImageDto;
import org.enactusensi.platform.dto.project.ProjectImageRequest;
import org.enactusensi.platform.dto.project.ProjectRequest;
import org.enactusensi.platform.service.ProjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/projects")
public class AdminProjectController {

    private final ProjectService projectService;

    public AdminProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public List<AdminProjectResponse> listAll() {
        return projectService.listAll();
    }

    @GetMapping("/{id}")
    public AdminProjectResponse getById(@PathVariable Long id) {
        return projectService.getById(id);
    }

    @PostMapping
    public ResponseEntity<AdminProjectResponse> create(@Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.create(request));
    }

    @PutMapping("/{id}")
    public AdminProjectResponse update(@PathVariable Long id, @Valid @RequestBody ProjectRequest request) {
        return projectService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/reorder")
    public ResponseEntity<Void> reorder(@Valid @RequestBody ReorderRequest request) {
        projectService.reorder(request.orderedIds());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<ProjectImageDto> addImage(@PathVariable Long id, @Valid @RequestBody ProjectImageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.addImage(id, request));
    }

    @DeleteMapping("/{id}/images/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id, @PathVariable Long imageId) {
        projectService.deleteImage(id, imageId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/images/reorder")
    public ResponseEntity<Void> reorderImages(@PathVariable Long id, @Valid @RequestBody ReorderRequest request) {
        projectService.reorderImages(id, request.orderedIds());
        return ResponseEntity.noContent().build();
    }
}
