package org.enactusensi.platform.controller.public_api;

import java.util.List;
import org.enactusensi.platform.dto.event.EventSummaryDto;
import org.enactusensi.platform.service.EventService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/events")
public class PublicEventController {

    private final EventService eventService;

    public PublicEventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public List<EventSummaryDto> listEvents() {
        return eventService.listPublic();
    }

    @GetMapping("/{slug}")
    public EventSummaryDto getEvent(@PathVariable String slug) {
        return eventService.getPublicBySlug(slug);
    }
}
