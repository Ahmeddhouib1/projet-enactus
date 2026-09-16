package org.enactusensi.platform.service;

import java.util.List;
import org.enactusensi.platform.dto.event.AdminEventResponse;
import org.enactusensi.platform.dto.event.EventEditionDto;
import org.enactusensi.platform.dto.event.EventEditionRequest;
import org.enactusensi.platform.dto.event.EventImageDto;
import org.enactusensi.platform.dto.event.EventImageRequest;
import org.enactusensi.platform.dto.event.EventRequest;
import org.enactusensi.platform.dto.event.EventSummaryDto;
import org.enactusensi.platform.entity.Event;
import org.enactusensi.platform.entity.EventEdition;
import org.enactusensi.platform.entity.EventImage;
import org.enactusensi.platform.exception.ResourceNotFoundException;
import org.enactusensi.platform.mapper.EventMapper;
import org.enactusensi.platform.repository.EventEditionRepository;
import org.enactusensi.platform.repository.EventImageRepository;
import org.enactusensi.platform.repository.EventRepository;
import org.enactusensi.platform.util.SlugUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final EventEditionRepository eventEditionRepository;
    private final EventImageRepository eventImageRepository;
    private final EventMapper eventMapper;

    public EventService(EventRepository eventRepository,
                         EventEditionRepository eventEditionRepository,
                         EventImageRepository eventImageRepository,
                         EventMapper eventMapper) {
        this.eventRepository = eventRepository;
        this.eventEditionRepository = eventEditionRepository;
        this.eventImageRepository = eventImageRepository;
        this.eventMapper = eventMapper;
    }

    @Transactional(readOnly = true)
    public List<EventSummaryDto> listPublic() {
        return eventRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(eventMapper::toSummaryDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public EventSummaryDto getPublicBySlug(String slug) {
        Event event = eventRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + slug));
        return eventMapper.toSummaryDto(event);
    }

    @Transactional(readOnly = true)
    public List<AdminEventResponse> listAll() {
        return eventRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(eventMapper::toAdminResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminEventResponse getById(Long id) {
        return eventMapper.toAdminResponse(findEventOrThrow(id));
    }

    @Transactional
    public AdminEventResponse create(EventRequest request) {
        Event entity = eventMapper.toEntity(request);
        entity.setSlug(SlugUtil.uniqueSlug(request.name(), eventRepository::existsBySlug));
        return eventMapper.toAdminResponse(eventRepository.save(entity));
    }

    @Transactional
    public AdminEventResponse update(Long id, EventRequest request) {
        Event entity = findEventOrThrow(id);
        eventMapper.updateEntity(request, entity);
        return eventMapper.toAdminResponse(eventRepository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found with id " + id);
        }
        eventRepository.deleteById(id);
    }

    @Transactional
    public EventEditionDto addEdition(Long eventId, EventEditionRequest request) {
        Event event = findEventOrThrow(eventId);
        EventEdition edition = eventMapper.toEntity(request);
        edition.setEvent(event);
        return eventMapper.toDto(eventEditionRepository.save(edition));
    }

    @Transactional
    public EventEditionDto updateEdition(Long eventId, Long editionId, EventEditionRequest request) {
        EventEdition edition = findEditionOrThrow(eventId, editionId);
        eventMapper.updateEntity(request, edition);
        return eventMapper.toDto(eventEditionRepository.save(edition));
    }

    @Transactional
    public void deleteEdition(Long eventId, Long editionId) {
        EventEdition edition = findEditionOrThrow(eventId, editionId);
        eventEditionRepository.delete(edition);
    }

    @Transactional
    public EventImageDto addEditionImage(Long eventId, Long editionId, EventImageRequest request) {
        EventEdition edition = findEditionOrThrow(eventId, editionId);
        EventImage image = eventMapper.toEntity(request);
        image.setEdition(edition);
        if (image.getDisplayOrder() == null) {
            image.setDisplayOrder(0);
        }
        return eventMapper.toDto(eventImageRepository.save(image));
    }

    @Transactional
    public void deleteEditionImage(Long eventId, Long editionId, Long imageId) {
        findEditionOrThrow(eventId, editionId);
        EventImage image = eventImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Event image not found with id " + imageId));
        if (!image.getEdition().getId().equals(editionId)) {
            throw new ResourceNotFoundException("Event image not found with id " + imageId);
        }
        eventImageRepository.delete(image);
    }

    @Transactional
    public void reorderEditionImages(Long eventId, Long editionId, List<Long> orderedIds) {
        findEditionOrThrow(eventId, editionId);
        List<EventImage> images = eventImageRepository.findByEditionIdOrderByDisplayOrderAsc(editionId);
        java.util.Map<Long, EventImage> byId = new java.util.HashMap<>();
        images.forEach(img -> byId.put(img.getId(), img));

        int position = 0;
        for (Long id : orderedIds) {
            EventImage image = byId.get(id);
            if (image == null) {
                throw new ResourceNotFoundException("Event image not found with id " + id);
            }
            image.setDisplayOrder(position++);
        }
        eventImageRepository.saveAll(byId.values());
    }

    @Transactional(readOnly = true)
    public long countTotalEvents() {
        return eventRepository.count();
    }

    @Transactional(readOnly = true)
    public long countTotalEditions() {
        return eventEditionRepository.count();
    }

    private Event findEventOrThrow(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id " + id));
    }

    private EventEdition findEditionOrThrow(Long eventId, Long editionId) {
        EventEdition edition = eventEditionRepository.findById(editionId)
                .orElseThrow(() -> new ResourceNotFoundException("Event edition not found with id " + editionId));
        if (!edition.getEvent().getId().equals(eventId)) {
            throw new ResourceNotFoundException("Event edition not found with id " + editionId);
        }
        return edition;
    }
}
