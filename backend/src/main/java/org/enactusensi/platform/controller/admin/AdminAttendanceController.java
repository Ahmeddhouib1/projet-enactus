package org.enactusensi.platform.controller.admin;

import java.util.List;
import org.enactusensi.platform.dto.member.AttendanceDto;
import org.enactusensi.platform.entity.MemberDepartment;
import org.enactusensi.platform.service.AttendanceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Collective ("fiche de presence collectif") attendance views used by the
 * Marketing, Sponsoring and SG spaces - one combined table across many
 * activities rather than a single activity or a single member.
 */
@RestController
@RequestMapping("/api/admin/attendance")
public class AdminAttendanceController {

    private final AttendanceService attendanceService;

    public AdminAttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping("/collective")
    public List<AttendanceDto> getCollective(@RequestParam(required = false) MemberDepartment department) {
        return attendanceService.getCollective(department);
    }
}
