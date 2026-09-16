package org.enactusensi.platform.mapper;

import org.enactusensi.platform.dto.document.DocumentDto;
import org.enactusensi.platform.entity.Document;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DocumentMapper {

    @Mapping(target = "projectId", source = "project.id")
    @Mapping(target = "projectName", source = "project.name")
    DocumentDto toDto(Document entity);
}
