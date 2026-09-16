package org.enactusensi.platform.mapper;

import org.enactusensi.platform.dto.partner.AdminPartnerResponse;
import org.enactusensi.platform.dto.partner.PartnerDto;
import org.enactusensi.platform.dto.partner.PartnerRequest;
import org.enactusensi.platform.entity.Partner;
import org.mapstruct.BeanMapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface PartnerMapper {

    PartnerDto toDto(Partner entity);

    AdminPartnerResponse toAdminResponse(Partner entity);

    Partner toEntity(PartnerRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(PartnerRequest request, @MappingTarget Partner entity);
}
