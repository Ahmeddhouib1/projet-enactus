package org.enactusensi.platform.service;

import java.util.List;
import org.enactusensi.platform.dto.member.ActivityDto;
import org.enactusensi.platform.dto.member.ActivityRequest;
import org.enactusensi.platform.entity.Activity;
import org.enactusensi.platform.entity.ActivityScope;
import org.enactusensi.platform.entity.Project;
import org.enactusensi.platform.exception.BadRequestException;
import org.enactusensi.platform.exception.ResourceNotFoundException;
import org.enactusensi.platform.mapper.ActivityMapper;
import org.enactusensi.platform.repository.ActivityRepository;
import org.enactusensi.platform.repository.ProjectRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final ProjectRepository projectRepository;
    private final ActivityMapper activityMapper;
    private final AttendanceService attendanceService;

    public ActivityService(ActivityRepository activityRepository,
                            ProjectRepository projectRepository,
                            ActivityMapper activityMapper,
                            @Lazy AttendanceService attendanceService) {
        this.activityRepository = activityRepository;
        this.projectRepository = projectRepository;
        this.activityMapper = activityMapper;
        this.attendanceService = attendanceService;
    }

    @Transactional(readOnly = true)
    public List<ActivityDto> listAll() {
        return activityRepository.findAllByOrderByActivityDateDesc().stream().map(activityMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public ActivityDto getById(Long id) {
        return activityMapper.toDto(findOrThrow(id));
    }

    @Transactional
    public ActivityDto create(ActivityRequest request) {
        Activity entity = activityMapper.toEntity(request);
        applyScope(entity, request);
        Activity saved = activityRepository.save(entity);
        attendanceService.initializeForActivity(saved);
        return activityMapper.toDto(saved);
    }

    @Transactional
    public ActivityDto update(Long id, ActivityRequest request) {
        Activity entity = findOrThrow(id);
        activityMapper.updateEntity(request, entity);
        applyScope(entity, request);
        Activity saved = activityRepository.save(entity);
        // Re-run in case the audience changed (e.g. scope or a project's
        // team membership) so newly-included members get a presence entry.
        attendanceService.initializeForActivity(saved);
        return activityMapper.toDto(saved);
    }

    @Transactional
    public void delete(Long id) {
        if (!activityRepository.existsById(id)) {
            throw new ResourceNotFoundException("Activity not found with id " + id);
        }
        activityRepository.deleteById(id);
    }

    Activity findOrThrow(Long id) {
        return activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id " + id));
    }

    /**
     * Scope fields are mutually exclusive by design (ALL / one department /
     * one project), so they're always set together here rather than merged
     * field-by-field, to avoid leaving a stale department or project behind
     * when an activity's audience is changed.
     */
    private void applyScope(Activity entity, ActivityRequest request) {
        entity.setScopeType(request.scopeType());
        switch (request.scopeType()) {
            case ALL -> {
                entity.setScopeDepartment(null);
                entity.setScopeProject(null);
            }
            case DEPARTMENT -> {
                if (request.scopeDepartment() == null) {
                    throw new BadRequestException("scopeDepartment is required when scopeType is DEPARTMENT");
                }
                entity.setScopeDepartment(request.scopeDepartment());
                entity.setScopeProject(null);
            }
            case PROJECT -> {
                if (request.scopeProjectId() == null) {
                    throw new BadRequestException("scopeProjectId is required when scopeType is PROJECT");
                }
                Project project = projectRepository.findById(request.scopeProjectId())
                        .orElseThrow(() -> new BadRequestException(
                                "scopeProjectId does not reference an existing project"));
                entity.setScopeProject(project);
                entity.setScopeDepartment(null);
            }
        }
    }
}
