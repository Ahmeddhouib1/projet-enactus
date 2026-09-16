package org.enactusensi.platform.controller.admin;

import jakarta.validation.Valid;
import java.util.List;
import org.enactusensi.platform.dto.ReorderRequest;
import org.enactusensi.platform.dto.partner.AdminPartnerResponse;
import org.enactusensi.platform.dto.partner.PartnerRequest;
import org.enactusensi.platform.service.PartnerService;
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
@RequestMapping("/api/admin/partners")
public class AdminPartnerController {

    private final PartnerService partnerService;

    public AdminPartnerController(PartnerService partnerService) {
        this.partnerService = partnerService;
    }

    @GetMapping
    public List<AdminPartnerResponse> listAll() {
        return partnerService.listAll();
    }

    @PostMapping
    public ResponseEntity<AdminPartnerResponse> create(@Valid @RequestBody PartnerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(partnerService.create(request));
    }

    @PutMapping("/{id}")
    public AdminPartnerResponse update(@PathVariable Long id, @Valid @RequestBody PartnerRequest request) {
        return partnerService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        partnerService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/reorder")
    public ResponseEntity<Void> reorder(@Valid @RequestBody ReorderRequest request) {
        partnerService.reorder(request.orderedIds());
        return ResponseEntity.noContent().build();
    }
}
