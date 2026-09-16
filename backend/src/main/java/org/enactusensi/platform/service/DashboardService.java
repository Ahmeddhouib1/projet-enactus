package org.enactusensi.platform.service;

import org.enactusensi.platform.dto.DashboardStatsDto;
import org.enactusensi.platform.repository.PartnerRepository;
import org.enactusensi.platform.repository.TeamMemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {

    private final ProjectService projectService;
    private final EventService eventService;
    private final PartnerRepository partnerRepository;
    private final TeamMemberRepository teamMemberRepository;

    public DashboardService(ProjectService projectService,
                             EventService eventService,
                             PartnerRepository partnerRepository,
                             TeamMemberRepository teamMemberRepository) {
        this.projectService = projectService;
        this.eventService = eventService;
        this.partnerRepository = partnerRepository;
        this.teamMemberRepository = teamMemberRepository;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getStats() {
        return new DashboardStatsDto(
                projectService.countTotal(),
                projectService.countActive(),
                eventService.countTotalEvents(),
                eventService.countTotalEditions(),
                partnerRepository.count(),
                partnerRepository.countByActiveTrue(),
                teamMemberRepository.count()
        );
    }
}
