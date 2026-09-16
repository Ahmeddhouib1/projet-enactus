package org.enactusensi.platform.mapper;

import org.enactusensi.platform.dto.content.AdminValueResponse;
import org.enactusensi.platform.dto.content.SiteContentDto;
import org.enactusensi.platform.dto.content.SiteContentUpdateRequest;
import org.enactusensi.platform.dto.content.ValueDto;
import org.enactusensi.platform.dto.content.ValueRequest;
import org.enactusensi.platform.entity.SiteContent;
import org.enactusensi.platform.entity.Value;
import org.mapstruct.BeanMapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ContentMapper {

    SiteContentDto toDto(SiteContent entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(SiteContentUpdateRequest request, @MappingTarget SiteContent entity);

    ValueDto toDto(Value entity);

    AdminValueResponse toAdminResponse(Value entity);

    Value toEntity(ValueRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(ValueRequest request, @MappingTarget Value entity);
}
