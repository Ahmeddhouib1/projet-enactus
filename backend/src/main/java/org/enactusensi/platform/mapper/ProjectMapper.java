package org.enactusensi.platform.mapper;

import org.enactusensi.platform.dto.project.AdminProjectResponse;
import org.enactusensi.platform.dto.project.ProjectDetailDto;
import org.enactusensi.platform.dto.project.ProjectImageDto;
import org.enactusensi.platform.dto.project.ProjectRequest;
import org.enactusensi.platform.dto.project.ProjectSummaryDto;
import org.enactusensi.platform.entity.Project;
import org.enactusensi.platform.entity.ProjectImage;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ProjectMapper {

    ProjectSummaryDto toSummaryDto(Project entity);

    ProjectDetailDto toDetailDto(Project entity);

    AdminProjectResponse toAdminResponse(Project entity);

    ProjectImageDto toDto(ProjectImage entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "images", ignore = true)
    Project toEntity(ProjectRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "images", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(ProjectRequest request, @MappingTarget Project entity);
}
