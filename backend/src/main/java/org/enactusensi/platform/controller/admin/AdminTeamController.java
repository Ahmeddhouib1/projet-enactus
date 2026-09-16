package org.enactusensi.platform.controller.admin;

import jakarta.validation.Valid;
import java.util.List;
import org.enactusensi.platform.dto.ReorderRequest;
import org.enactusensi.platform.dto.team.AdminTeamMemberResponse;
import org.enactusensi.platform.dto.team.TeamMemberRequest;
import org.enactusensi.platform.service.TeamMemberService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/team")
public class AdminTeamController {

    private final TeamMemberService teamMemberService;

    public AdminTeamController(TeamMemberService teamMemberService) {
        this.teamMemberService = teamMemberService;
    }

    @GetMapping
    public List<AdminTeamMemberResponse> listAll() {
        return teamMemberService.listAll();
    }

    @PostMapping
    public ResponseEntity<AdminTeamMemberResponse> create(@Valid @RequestBody TeamMemberRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(teamMemberService.create(request));
    }

    @PutMapping("/{id}")
    public AdminTeamMemberResponse update(@PathVariable Long id, @Valid @RequestBody TeamMemberRequest request) {
        return teamMemberService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        teamMemberService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/reorder")
    public ResponseEntity<Void> reorder(@Valid @RequestBody ReorderRequest request) {
        teamMemberService.reorder(request.orderedIds());
        return ResponseEntity.noContent().build();
    }
}
