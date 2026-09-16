package org.enactusensi.platform.controller.admin;

import jakarta.validation.Valid;
import org.enactusensi.platform.dto.content.SiteContentDto;
import org.enactusensi.platform.dto.content.SiteContentUpdateRequest;
import org.enactusensi.platform.service.SiteContentService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/content")
public class AdminContentController {

    private final SiteContentService siteContentService;

    public AdminContentController(SiteContentService siteContentService) {
        this.siteContentService = siteContentService;
    }

    @GetMapping
    public SiteContentDto getContent() {
        return siteContentService.getContent();
    }

    @PutMapping
    public SiteContentDto updateContent(@Valid @RequestBody SiteContentUpdateRequest request) {
        return siteContentService.updateContent(request);
    }
}
