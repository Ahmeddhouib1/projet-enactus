package org.enactusensi.platform.mapper;

import org.enactusensi.platform.dto.member.MemberDto;
import org.enactusensi.platform.dto.member.MemberRequest;
import org.enactusensi.platform.dto.member.ProjectRef;
import org.enactusensi.platform.entity.Member;
import org.enactusensi.platform.entity.Project;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface MemberMapper {

    @Mapping(target = "hasPmPassword", expression = "java(entity.getPmPasswordHash() != null)")
    MemberDto toDto(Member entity);

    ProjectRef toRef(Project project);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "projects", ignore = true)
    Member toEntity(MemberRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "projects", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(MemberRequest request, @MappingTarget Member entity);
}
