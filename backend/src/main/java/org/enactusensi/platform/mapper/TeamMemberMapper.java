package org.enactusensi.platform.mapper;

import org.enactusensi.platform.dto.team.AdminTeamMemberResponse;
import org.enactusensi.platform.dto.team.TeamMemberDto;
import org.enactusensi.platform.dto.team.TeamMemberRequest;
import org.enactusensi.platform.entity.TeamMember;
import org.mapstruct.BeanMapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface TeamMemberMapper {

    TeamMemberDto toDto(TeamMember entity);

    AdminTeamMemberResponse toAdminResponse(TeamMember entity);

    TeamMember toEntity(TeamMemberRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(TeamMemberRequest request, @MappingTarget TeamMember entity);
}
