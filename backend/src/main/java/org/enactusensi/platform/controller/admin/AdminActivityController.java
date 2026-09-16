package org.enactusensi.platform.controller.admin;

import jakarta.validation.Valid;
import java.util.List;
import org.enactusensi.platform.dto.member.ActivityDto;
import org.enactusensi.platform.dto.member.ActivityRequest;
import org.enactusensi.platform.dto.member.AttendanceBulkRequest;
import org.enactusensi.platform.dto.member.AttendanceDto;
import org.enactusensi.platform.service.ActivityService;
import org.enactusensi.platform.service.AttendanceService;
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
@RequestMapping("/api/admin/activities")
public class AdminActivityController {

    private final ActivityService activityService;
    private final AttendanceService attendanceService;

    public AdminActivityController(ActivityService activityService, AttendanceService attendanceService) {
        this.activityService = activityService;
        this.attendanceService = attendanceService;
    }

    @GetMapping
    public List<ActivityDto> listAll() {
        return activityService.listAll();
    }

    @GetMapping("/{id}")
    public ActivityDto getById(@PathVariable Long id) {
        return activityService.getById(id);
    }

    @PostMapping
    public ResponseEntity<ActivityDto> create(@Valid @RequestBody ActivityRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(activityService.create(request));
    }

    @PutMapping("/{id}")
    public ActivityDto update(@PathVariable Long id, @Valid @RequestBody ActivityRequest request) {
        return activityService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        activityService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/attendance")
    public List<AttendanceDto> getAttendance(@PathVariable Long id) {
        return attendanceService.getForActivity(id);
    }

    @PutMapping("/{id}/attendance")
    public List<AttendanceDto> saveAttendance(@PathVariable Long id, @Valid @RequestBody AttendanceBulkRequest request) {
        return attendanceService.upsertForActivity(id, request.entries());
    }
}
