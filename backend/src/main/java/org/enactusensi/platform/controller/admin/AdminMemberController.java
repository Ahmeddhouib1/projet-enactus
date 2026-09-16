package org.enactusensi.platform.controller.admin;

import jakarta.validation.Valid;
import java.util.List;
import org.enactusensi.platform.dto.member.AttendanceDto;
import org.enactusensi.platform.dto.member.AttendanceUpdateRequest;
import org.enactusensi.platform.dto.member.MemberDto;
import org.enactusensi.platform.dto.member.MemberRequest;
import org.enactusensi.platform.dto.member.PmPasswordRequest;
import org.enactusensi.platform.dto.member.PmPasswordVerifyResponse;
import org.enactusensi.platform.service.AttendanceService;
import org.enactusensi.platform.service.MemberService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/members")
public class AdminMemberController {

    private final MemberService memberService;
    private final AttendanceService attendanceService;

    public AdminMemberController(MemberService memberService, AttendanceService attendanceService) {
        this.memberService = memberService;
        this.attendanceService = attendanceService;
    }

    @GetMapping
    public List<MemberDto> listAll(@RequestParam(required = false) Long projectId) {
        return projectId != null ? memberService.listByProject(projectId) : memberService.listAll();
    }

    @GetMapping("/{id}")
    public MemberDto getById(@PathVariable Long id) {
        return memberService.getById(id);
    }

    @PostMapping
    public ResponseEntity<MemberDto> create(@Valid @RequestBody MemberRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(memberService.create(request));
    }

    @PutMapping("/{id}")
    public MemberDto update(@PathVariable Long id, @Valid @RequestBody MemberRequest request) {
        return memberService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        memberService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/attendance")
    public List<AttendanceDto> getPresenceSheet(@PathVariable Long id) {
        return attendanceService.getForMember(id);
    }

    @PutMapping("/{id}/attendance/{activityId}")
    public AttendanceDto updatePresenceEntry(@PathVariable Long id, @PathVariable Long activityId,
                                              @Valid @RequestBody AttendanceUpdateRequest request) {
        return attendanceService.updateSingle(id, activityId, request);
    }

    @PostMapping("/{id}/pm-password")
    public ResponseEntity<Void> setPmPassword(@PathVariable Long id, @Valid @RequestBody PmPasswordRequest request) {
        memberService.setPmPassword(id, request.password());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/{id}/pm-password/verify")
    public PmPasswordVerifyResponse verifyPmPassword(@PathVariable Long id, @Valid @RequestBody PmPasswordRequest request) {
        return new PmPasswordVerifyResponse(memberService.verifyPmPassword(id, request.password()));
    }

    @DeleteMapping("/{id}/pm-password")
    public ResponseEntity<Void> resetPmPassword(@PathVariable Long id) {
        memberService.resetPmPassword(id);
        return ResponseEntity.noContent().build();
    }
}
