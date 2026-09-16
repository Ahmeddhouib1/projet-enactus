package org.enactusensi.platform.service;

import org.enactusensi.platform.dto.content.SiteContentDto;
import org.enactusensi.platform.dto.content.SiteContentUpdateRequest;
import org.enactusensi.platform.entity.SiteContent;
import org.enactusensi.platform.exception.ResourceNotFoundException;
import org.enactusensi.platform.mapper.ContentMapper;
import org.enactusensi.platform.repository.SiteContentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SiteContentService {

    private static final long SINGLETON_ID = 1L;

    private final SiteContentRepository siteContentRepository;
    private final ContentMapper contentMapper;

    public SiteContentService(SiteContentRepository siteContentRepository, ContentMapper contentMapper) {
        this.siteContentRepository = siteContentRepository;
        this.contentMapper = contentMapper;
    }

    @Transactional(readOnly = true)
    public SiteContentDto getContent() {
        return contentMapper.toDto(getOrCreateSingleton());
    }

    @Transactional
    public SiteContentDto updateContent(SiteContentUpdateRequest request) {
        SiteContent entity = getOrCreateSingleton();
        contentMapper.updateEntity(request, entity);
        return contentMapper.toDto(siteContentRepository.save(entity));
    }

    private SiteContent getOrCreateSingleton() {
        return siteContentRepository.findById(SINGLETON_ID)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Site content row is missing - Flyway migration V2 should have seeded it."));
    }
}
