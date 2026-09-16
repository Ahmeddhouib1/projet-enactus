package org.enactusensi.platform.controller.admin;

import jakarta.validation.Valid;
import java.util.List;
import org.enactusensi.platform.dto.ReorderRequest;
import org.enactusensi.platform.dto.event.AdminEventResponse;
import org.enactusensi.platform.dto.event.EventEditionDto;
import org.enactusensi.platform.dto.event.EventEditionRequest;
import org.enactusensi.platform.dto.event.EventImageDto;
import org.enactusensi.platform.dto.event.EventImageRequest;
import org.enactusensi.platform.dto.event.EventRequest;
import org.enactusensi.platform.service.EventService;
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
@RequestMapping("/api/admin/events")
public class AdminEventController {

    private final EventService eventService;

    public AdminEventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public List<AdminEventResponse> listAll() {
        return eventService.listAll();
    }

    @GetMapping("/{id}")
    public AdminEventResponse getById(@PathVariable Long id) {
        return eventService.getById(id);
    }

    @PostMapping
    public ResponseEntity<AdminEventResponse> create(@Valid @RequestBody EventRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.create(request));
    }

    @PutMapping("/{id}")
    public AdminEventResponse update(@PathVariable Long id, @Valid @RequestBody EventRequest request) {
        return eventService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        eventService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/editions")
    public ResponseEntity<EventEditionDto> addEdition(@PathVariable Long id, @Valid @RequestBody EventEditionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.addEdition(id, request));
    }

    @PutMapping("/{id}/editions/{editionId}")
    public EventEditionDto updateEdition(@PathVariable Long id, @PathVariable Long editionId,
                                          @Valid @RequestBody EventEditionRequest request) {
        return eventService.updateEdition(id, editionId, request);
    }

    @DeleteMapping("/{id}/editions/{editionId}")
    public ResponseEntity<Void> deleteEdition(@PathVariable Long id, @PathVariable Long editionId) {
        eventService.deleteEdition(id, editionId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/editions/{editionId}/images")
    public ResponseEntity<EventImageDto> addEditionImage(@PathVariable Long id, @PathVariable Long editionId,
                                                           @Valid @RequestBody EventImageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.addEditionImage(id, editionId, request));
    }

    @DeleteMapping("/{id}/editions/{editionId}/images/{imageId}")
    public ResponseEntity<Void> deleteEditionImage(@PathVariable Long id, @PathVariable Long editionId,
                                                     @PathVariable Long imageId) {
        eventService.deleteEditionImage(id, editionId, imageId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/editions/{editionId}/images/reorder")
    public ResponseEntity<Void> reorderEditionImages(@PathVariable Long id, @PathVariable Long editionId,
                                                       @Valid @RequestBody ReorderRequest request) {
        eventService.reorderEditionImages(id, editionId, request.orderedIds());
        return ResponseEntity.noContent().build();
    }
}
