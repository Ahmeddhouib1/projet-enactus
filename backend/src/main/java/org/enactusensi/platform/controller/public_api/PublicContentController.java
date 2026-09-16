package org.enactusensi.platform.controller.public_api;

import java.util.List;
import org.enactusensi.platform.dto.content.SiteContentDto;
import org.enactusensi.platform.dto.content.ValueDto;
import org.enactusensi.platform.service.SiteContentService;
import org.enactusensi.platform.service.ValueService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class PublicContentController {

    private final SiteContentService siteContentService;
    private final ValueService valueService;

    public PublicContentController(SiteContentService siteContentService, ValueService valueService) {
        this.siteContentService = siteContentService;
        this.valueService = valueService;
    }

    @GetMapping("/content")
    public SiteContentDto getContent() {
        return siteContentService.getContent();
    }

    @GetMapping("/values")
    public List<ValueDto> getValues() {
        return valueService.listActive();
    }
}
