package org.enactusensi.platform.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.enactusensi.platform.dto.project.AdminProjectResponse;
import org.enactusensi.platform.dto.project.ProjectDetailDto;
import org.enactusensi.platform.dto.project.ProjectImageDto;
import org.enactusensi.platform.dto.project.ProjectImageRequest;
import org.enactusensi.platform.dto.project.ProjectRequest;
import org.enactusensi.platform.dto.project.ProjectSummaryDto;
import org.enactusensi.platform.entity.Project;
import org.enactusensi.platform.entity.ProjectImage;
import org.enactusensi.platform.entity.ProjectStatus;
import org.enactusensi.platform.exception.ResourceNotFoundException;
import org.enactusensi.platform.mapper.ProjectMapper;
import org.enactusensi.platform.repository.ProjectImageRepository;
import org.enactusensi.platform.repository.ProjectRepository;
import org.enactusensi.platform.util.SlugUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectImageRepository projectImageRepository;
    private final ProjectMapper projectMapper;

    public ProjectService(ProjectRepository projectRepository,
                           ProjectImageRepository projectImageRepository,
                           ProjectMapper projectMapper) {
        this.projectRepository = projectRepository;
        this.projectImageRepository = projectImageRepository;
        this.projectMapper = projectMapper;
    }

    @Transactional(readOnly = true)
    public List<ProjectSummaryDto> listPublic(boolean featuredOnly) {
        List<Project> projects = featuredOnly
                ? projectRepository.findAllByFeaturedTrueAndStatusNotOrderByDisplayOrderAsc(ProjectStatus.ARCHIVED)
                : projectRepository.findAllByStatusNotOrderByDisplayOrderAsc(ProjectStatus.ARCHIVED);
        return projects.stream().map(projectMapper::toSummaryDto).toList();
    }

    @Transactional(readOnly = true)
    public ProjectDetailDto getPublicBySlug(String slug) {
        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + slug));
        if (project.getStatus() == ProjectStatus.ARCHIVED) {
            throw new ResourceNotFoundException("Project not found: " + slug);
        }
        return projectMapper.toDetailDto(project);
    }

    @Transactional(readOnly = true)
    public List<AdminProjectResponse> listAll() {
        return projectRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(projectMapper::toAdminResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminProjectResponse getById(Long id) {
        return projectMapper.toAdminResponse(findOrThrow(id));
    }

    @Transactional
    public AdminProjectResponse create(ProjectRequest request) {
        Project entity = projectMapper.toEntity(request);
        entity.setSlug(SlugUtil.uniqueSlug(request.name(), projectRepository::existsBySlug));
        return projectMapper.toAdminResponse(projectRepository.save(entity));
    }

    @Transactional
    public AdminProjectResponse update(Long id, ProjectRequest request) {
        Project entity = findOrThrow(id);
        projectMapper.updateEntity(request, entity);
        return projectMapper.toAdminResponse(projectRepository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project not found with id " + id);
        }
        projectRepository.deleteById(id);
    }

    @Transactional
    public void reorder(List<Long> orderedIds) {
        Map<Long, Project> byId = new HashMap<>();
        projectRepository.findAllById(orderedIds).forEach(p -> byId.put(p.getId(), p));

        int position = 0;
        for (Long id : orderedIds) {
            Project entity = byId.get(id);
            if (entity == null) {
                throw new ResourceNotFoundException("Project not found with id " + id);
            }
            entity.setDisplayOrder(position++);
        }
        projectRepository.saveAll(byId.values());
    }

    @Transactional
    public ProjectImageDto addImage(Long projectId, ProjectImageRequest request) {
        Project project = findOrThrow(projectId);
        ProjectImage image = new ProjectImage();
        image.setProject(project);
        image.setImageUrl(request.imageUrl());
        image.setCaption(request.caption());
        image.setDisplayOrder(request.displayOrder() == null ? 0 : request.displayOrder());
        return projectMapper.toDto(projectImageRepository.save(image));
    }

    @Transactional
    public void deleteImage(Long projectId, Long imageId) {
        ProjectImage image = projectImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Project image not found with id " + imageId));
        if (!image.getProject().getId().equals(projectId)) {
            throw new ResourceNotFoundException("Project image not found with id " + imageId);
        }
        projectImageRepository.delete(image);
    }

    @Transactional
    public void reorderImages(Long projectId, List<Long> orderedIds) {
        Map<Long, ProjectImage> byId = new HashMap<>();
        projectImageRepository.findByProjectIdOrderByDisplayOrderAsc(projectId)
                .forEach(img -> byId.put(img.getId(), img));

        int position = 0;
        for (Long id : orderedIds) {
            ProjectImage image = byId.get(id);
            if (image == null) {
                throw new ResourceNotFoundException("Project image not found with id " + id);
            }
            image.setDisplayOrder(position++);
        }
        projectImageRepository.saveAll(byId.values());
    }

    @Transactional(readOnly = true)
    public long countTotal() {
        return projectRepository.count();
    }

    @Transactional(readOnly = true)
    public long countActive() {
        return projectRepository.countByStatus(ProjectStatus.ACTIVE);
    }

    private Project findOrThrow(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id " + id));
    }
}
