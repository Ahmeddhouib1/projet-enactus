package org.enactusensi.platform.controller.admin;

import org.enactusensi.platform.dto.DashboardStatsDto;
import org.enactusensi.platform.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final DashboardService dashboardService;

    public AdminDashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public DashboardStatsDto getStats() {
        return dashboardService.getStats();
    }
}
