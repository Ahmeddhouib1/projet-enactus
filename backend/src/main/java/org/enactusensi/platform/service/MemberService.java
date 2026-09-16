package org.enactusensi.platform.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.enactusensi.platform.dto.member.MemberDto;
import org.enactusensi.platform.dto.member.MemberRequest;
import org.enactusensi.platform.entity.Member;
import org.enactusensi.platform.entity.Project;
import org.enactusensi.platform.exception.BadRequestException;
import org.enactusensi.platform.exception.DuplicateResourceException;
import org.enactusensi.platform.exception.ResourceNotFoundException;
import org.enactusensi.platform.mapper.MemberMapper;
import org.enactusensi.platform.repository.MemberRepository;
import org.enactusensi.platform.repository.ProjectRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MemberService {

    private final MemberRepository memberRepository;
    private final ProjectRepository projectRepository;
    private final MemberMapper memberMapper;
    private final PasswordEncoder passwordEncoder;

    public MemberService(MemberRepository memberRepository, ProjectRepository projectRepository,
                          MemberMapper memberMapper, PasswordEncoder passwordEncoder) {
        this.memberRepository = memberRepository;
        this.projectRepository = projectRepository;
        this.memberMapper = memberMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<MemberDto> listAll() {
        return memberRepository.findAllByOrderByFullNameAsc().stream().map(memberMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<MemberDto> listByProject(Long projectId) {
        return memberRepository.findAllByProjects_IdOrderByFullNameAsc(projectId).stream()
                .map(memberMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public MemberDto getById(Long id) {
        return memberMapper.toDto(findOrThrow(id));
    }

    @Transactional
    public MemberDto create(MemberRequest request) {
        if (memberRepository.existsByEmailIgnoreCase(request.email())) {
            throw new DuplicateResourceException("A member with email " + request.email() + " already exists");
        }
        Member entity = memberMapper.toEntity(request);
        entity.setProjects(resolveProjects(request.projectIds()));
        return memberMapper.toDto(memberRepository.save(entity));
    }

    @Transactional
    public MemberDto update(Long id, MemberRequest request) {
        Member entity = findOrThrow(id);
        if (memberRepository.existsByEmailIgnoreCaseAndIdNot(request.email(), id)) {
            throw new DuplicateResourceException("A member with email " + request.email() + " already exists");
        }
        memberMapper.updateEntity(request, entity);
        entity.setProjects(resolveProjects(request.projectIds()));
        return memberMapper.toDto(memberRepository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        if (!memberRepository.existsById(id)) {
            throw new ResourceNotFoundException("Member not found with id " + id);
        }
        memberRepository.deleteById(id);
    }

    /**
     * Sets a member's Project Space password on first use only - a
     * self-service unlock layered on top of the admin login, not a
     * replacement for it.
     */
    @Transactional
    public void setPmPassword(Long id, String rawPassword) {
        Member member = findOrThrow(id);
        if (member.getPmPasswordHash() != null) {
            throw new BadRequestException("A password has already been set for this member. Ask an admin to reset it.");
        }
        member.setPmPasswordHash(passwordEncoder.encode(rawPassword));
        memberRepository.save(member);
    }

    @Transactional(readOnly = true)
    public boolean verifyPmPassword(Long id, String rawPassword) {
        Member member = findOrThrow(id);
        if (member.getPmPasswordHash() == null) {
            throw new BadRequestException("No password has been set for this member yet.");
        }
        return passwordEncoder.matches(rawPassword, member.getPmPasswordHash());
    }

    @Transactional
    public void resetPmPassword(Long id) {
        Member member = findOrThrow(id);
        member.setPmPasswordHash(null);
        memberRepository.save(member);
    }

    private Set<Project> resolveProjects(List<Long> projectIds) {
        if (projectIds == null || projectIds.isEmpty()) {
            return new HashSet<>();
        }
        List<Project> found = projectRepository.findAllById(projectIds);
        if (found.size() != projectIds.stream().distinct().count()) {
            throw new BadRequestException("One or more projectIds do not exist");
        }
        return new HashSet<>(found);
    }

    private Member findOrThrow(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id " + id));
    }
}
