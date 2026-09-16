package org.enactusensi.platform.mapper;

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
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface EventMapper {

    EventSummaryDto toSummaryDto(Event entity);

    AdminEventResponse toAdminResponse(Event entity);

    EventEditionDto toDto(EventEdition entity);

    EventImageDto toDto(EventImage entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "editions", ignore = true)
    Event toEntity(EventRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "editions", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(EventRequest request, @MappingTarget Event entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "event", ignore = true)
    @Mapping(target = "images", ignore = true)
    EventEdition toEntity(EventEditionRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "event", ignore = true)
    @Mapping(target = "images", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(EventEditionRequest request, @MappingTarget EventEdition entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "edition", ignore = true)
    EventImage toEntity(EventImageRequest request);
}
