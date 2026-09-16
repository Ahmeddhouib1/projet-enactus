package org.enactusensi.platform.dto;

public record DashboardStatsDto(
        long totalProjects,
        long activeProjects,
        long totalEvents,
        long totalEventEditions,
        long totalPartners,
        long activePartners,
        long totalTeamMembers
) {
}
