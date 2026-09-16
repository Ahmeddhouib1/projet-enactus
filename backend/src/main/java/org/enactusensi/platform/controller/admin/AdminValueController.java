package org.enactusensi.platform.controller.admin;

import jakarta.validation.Valid;
import java.util.List;
import org.enactusensi.platform.dto.ReorderRequest;
import org.enactusensi.platform.dto.content.AdminValueResponse;
import org.enactusensi.platform.dto.content.ValueRequest;
import org.enactusensi.platform.service.ValueService;
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
@RequestMapping("/api/admin/values")
public class AdminValueController {

    private final ValueService valueService;

    public AdminValueController(ValueService valueService) {
        this.valueService = valueService;
    }

    @GetMapping
    public List<AdminValueResponse> listAll() {
        return valueService.listAll();
    }

    @PostMapping
    public ResponseEntity<AdminValueResponse> create(@Valid @RequestBody ValueRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(valueService.create(request));
    }

    @PutMapping("/{id}")
    public AdminValueResponse update(@PathVariable Long id, @Valid @RequestBody ValueRequest request) {
        return valueService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        valueService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/reorder")
    public ResponseEntity<Void> reorder(@Valid @RequestBody ReorderRequest request) {
        valueService.reorder(request.orderedIds());
        return ResponseEntity.noContent().build();
    }
}
