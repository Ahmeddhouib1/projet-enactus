package org.enactusensi.platform.controller.admin;

import jakarta.validation.Valid;
import java.util.List;
import org.enactusensi.platform.dto.document.DocumentDto;
import org.enactusensi.platform.dto.document.DocumentRequest;
import org.enactusensi.platform.entity.DocumentScope;
import org.enactusensi.platform.exception.BadRequestException;
import org.enactusensi.platform.service.DocumentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/documents")
public class AdminDocumentController {

    private final DocumentService documentService;

    public AdminDocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    public List<DocumentDto> list(@RequestParam(required = false) DocumentScope scope,
                                   @RequestParam(required = false) Long projectId) {
        if (projectId != null) {
            return documentService.listByProject(projectId);
        }
        if (scope != null) {
            return documentService.listByScope(scope);
        }
        throw new BadRequestException("Either scope or projectId must be provided");
    }

    @PostMapping
    public ResponseEntity<DocumentDto> create(@Valid @RequestBody DocumentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(documentService.create(request));
    }

    @PutMapping("/{id}")
    public DocumentDto update(@PathVariable Long id, @Valid @RequestBody DocumentRequest request) {
        return documentService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        documentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
