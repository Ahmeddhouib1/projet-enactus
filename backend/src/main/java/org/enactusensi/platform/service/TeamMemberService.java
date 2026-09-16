package org.enactusensi.platform.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.enactusensi.platform.dto.team.AdminTeamMemberResponse;
import org.enactusensi.platform.dto.team.TeamMemberDto;
import org.enactusensi.platform.dto.team.TeamMemberRequest;
import org.enactusensi.platform.entity.TeamMember;
import org.enactusensi.platform.exception.ResourceNotFoundException;
import org.enactusensi.platform.mapper.TeamMemberMapper;
import org.enactusensi.platform.repository.TeamMemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TeamMemberService {

    private final TeamMemberRepository teamMemberRepository;
    private final TeamMemberMapper teamMemberMapper;

    public TeamMemberService(TeamMemberRepository teamMemberRepository, TeamMemberMapper teamMemberMapper) {
        this.teamMemberRepository = teamMemberRepository;
        this.teamMemberMapper = teamMemberMapper;
    }

    @Transactional(readOnly = true)
    public List<TeamMemberDto> listActive() {
        return teamMemberRepository.findAllByActiveTrueOrderByDisplayOrderAsc().stream()
                .map(teamMemberMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AdminTeamMemberResponse> listAll() {
        return teamMemberRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(teamMemberMapper::toAdminResponse)
                .toList();
    }

    @Transactional
    public AdminTeamMemberResponse create(TeamMemberRequest request) {
        TeamMember entity = teamMemberMapper.toEntity(request);
        return teamMemberMapper.toAdminResponse(teamMemberRepository.save(entity));
    }

    @Transactional
    public AdminTeamMemberResponse update(Long id, TeamMemberRequest request) {
        TeamMember entity = findOrThrow(id);
        teamMemberMapper.updateEntity(request, entity);
        return teamMemberMapper.toAdminResponse(teamMemberRepository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        if (!teamMemberRepository.existsById(id)) {
            throw new ResourceNotFoundException("Team member not found with id " + id);
        }
        teamMemberRepository.deleteById(id);
    }

    @Transactional
    public void reorder(List<Long> orderedIds) {
        Map<Long, TeamMember> byId = new HashMap<>();
        teamMemberRepository.findAllById(orderedIds).forEach(m -> byId.put(m.getId(), m));

        int position = 0;
        for (Long id : orderedIds) {
            TeamMember entity = byId.get(id);
            if (entity == null) {
                throw new ResourceNotFoundException("Team member not found with id " + id);
            }
            entity.setDisplayOrder(position++);
        }
        teamMemberRepository.saveAll(byId.values());
    }

    private TeamMember findOrThrow(Long id) {
        return teamMemberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team member not found with id " + id));
    }
}
