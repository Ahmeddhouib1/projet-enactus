package org.enactusensi.platform.mapper;

import org.enactusensi.platform.dto.member.ActivityDto;
import org.enactusensi.platform.dto.member.ActivityRequest;
import org.enactusensi.platform.entity.Activity;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", uses = MemberMapper.class)
public interface ActivityMapper {

    ActivityDto toDto(Activity entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "scopeProject", ignore = true)
    Activity toEntity(ActivityRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "scopeProject", ignore = true)
    @Mapping(target = "scopeDepartment", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(ActivityRequest request, @MappingTarget Activity entity);
}
