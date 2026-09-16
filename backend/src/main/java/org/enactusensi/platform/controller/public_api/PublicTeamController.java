package org.enactusensi.platform.controller.public_api;

import java.util.List;
import org.enactusensi.platform.dto.team.TeamMemberDto;
import org.enactusensi.platform.service.TeamMemberService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/team")
public class PublicTeamController {

    private final TeamMemberService teamMemberService;

    public PublicTeamController(TeamMemberService teamMemberService) {
        this.teamMemberService = teamMemberService;
    }

    @GetMapping
    public List<TeamMemberDto> listTeam() {
        return teamMemberService.listActive();
    }
}
