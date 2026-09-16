package org.enactusensi.platform.controller.public_api;

import java.util.List;
import org.enactusensi.platform.dto.project.ProjectDetailDto;
import org.enactusensi.platform.dto.project.ProjectSummaryDto;
import org.enactusensi.platform.service.ProjectService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/projects")
public class PublicProjectController {

    private final ProjectService projectService;

    public PublicProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public List<ProjectSummaryDto> listProjects(
            @RequestParam(name = "featured", required = false, defaultValue = "false") boolean featured) {
        return projectService.listPublic(featured);
    }

    @GetMapping("/{slug}")
    public ProjectDetailDto getProject(@PathVariable String slug) {
        return projectService.getPublicBySlug(slug);
    }
}
