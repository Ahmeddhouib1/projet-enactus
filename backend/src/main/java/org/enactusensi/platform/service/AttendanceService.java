package org.enactusensi.platform.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.enactusensi.platform.dto.member.AttendanceDto;
import org.enactusensi.platform.dto.member.AttendanceEntryRequest;
import org.enactusensi.platform.dto.member.AttendanceUpdateRequest;
import org.enactusensi.platform.entity.Activity;
import org.enactusensi.platform.entity.ActivityScope;
import org.enactusensi.platform.entity.Attendance;
import org.enactusensi.platform.entity.Member;
import org.enactusensi.platform.entity.MemberDepartment;
import org.enactusensi.platform.exception.ResourceNotFoundException;
import org.enactusensi.platform.repository.ActivityRepository;
import org.enactusensi.platform.repository.AttendanceRepository;
import org.enactusensi.platform.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final MemberRepository memberRepository;
    private final ActivityRepository activityRepository;
    private final ActivityService activityService;

    public AttendanceService(AttendanceRepository attendanceRepository,
                              MemberRepository memberRepository,
                              ActivityRepository activityRepository,
                              ActivityService activityService) {
        this.attendanceRepository = attendanceRepository;
        this.memberRepository = memberRepository;
        this.activityRepository = activityRepository;
        this.activityService = activityService;
    }

    @Transactional(readOnly = true)
    public List<AttendanceDto> getForActivity(Long activityId) {
        Activity activity = activityService.findOrThrow(activityId);
        List<Member> members = resolveAudience(activity);
        Map<Long, Attendance> byMemberId = new HashMap<>();
        attendanceRepository.findByActivityIdOrderByMember_FullNameAsc(activityId)
                .forEach(a -> byMemberId.put(a.getMember().getId(), a));

        return members.stream()
                .map(member -> {
                    Attendance existing = byMemberId.get(member.getId());
                    return new AttendanceDto(
                            existing != null ? existing.getId() : null,
                            member.getId(),
                            member.getFullName(),
                            activity.getId(),
                            activity.getTitle(),
                            activity.getActivityDate(),
                            existing != null && existing.isPresent(),
                            existing != null ? existing.getRemark() : null
                    );
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AttendanceDto> getForMember(Long memberId) {
        if (!memberRepository.existsById(memberId)) {
            throw new ResourceNotFoundException("Member not found with id " + memberId);
        }
        return attendanceRepository.findByMemberIdOrderByActivity_ActivityDateDesc(memberId).stream()
                .map(a -> new AttendanceDto(
                        a.getId(),
                        a.getMember().getId(),
                        a.getMember().getFullName(),
                        a.getActivity().getId(),
                        a.getActivity().getTitle(),
                        a.getActivity().getActivityDate(),
                        a.isPresent(),
                        a.getRemark()
                ))
                .toList();
    }

    @Transactional
    public List<AttendanceDto> upsertForActivity(Long activityId, List<AttendanceEntryRequest> entries) {
        Activity activity = activityService.findOrThrow(activityId);

        for (AttendanceEntryRequest entry : entries) {
            Member member = memberRepository.findById(entry.memberId())
                    .orElseThrow(() -> new ResourceNotFoundException("Member not found with id " + entry.memberId()));

            Attendance attendance = attendanceRepository.findByMemberIdAndActivityId(entry.memberId(), activityId)
                    .orElseGet(() -> {
                        Attendance created = new Attendance();
                        created.setMember(member);
                        created.setActivity(activity);
                        return created;
                    });
            attendance.setPresent(entry.present());
            attendance.setRemark(entry.remark());
            attendanceRepository.save(attendance);
        }

        return getForActivity(activityId);
    }

    /**
     * Updates (or creates) a single member's attendance record for an
     * activity - used by the member-centric presence sheet view, where an
     * admin toggles presence/remark one member at a time.
     */
    @Transactional
    public AttendanceDto updateSingle(Long memberId, Long activityId, AttendanceUpdateRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id " + memberId));
        Activity activity = activityService.findOrThrow(activityId);

        Attendance attendance = attendanceRepository.findByMemberIdAndActivityId(memberId, activityId)
                .orElseGet(() -> {
                    Attendance created = new Attendance();
                    created.setMember(member);
                    created.setActivity(activity);
                    return created;
                });
        attendance.setPresent(request.present());
        attendance.setRemark(request.remark());
        Attendance saved = attendanceRepository.save(attendance);

        return new AttendanceDto(
                saved.getId(), member.getId(), member.getFullName(),
                activity.getId(), activity.getTitle(), activity.getActivityDate(),
                saved.isPresent(), saved.getRemark());
    }

    /**
     * Seeds a default (not present, no remark) attendance record for every
     * member currently in an activity's audience, so the activity shows up
     * on their presence sheet immediately - without this, a member's sheet
     * stayed empty until someone explicitly saved attendance at least once.
     * Never overwrites or removes existing records.
     */
    @Transactional
    public void initializeForActivity(Activity activity) {
        Set<Long> alreadyTracked = new HashSet<>();
        attendanceRepository.findByActivityIdOrderByMember_FullNameAsc(activity.getId())
                .forEach(a -> alreadyTracked.add(a.getMember().getId()));

        for (Member member : resolveAudience(activity)) {
            if (alreadyTracked.contains(member.getId())) {
                continue;
            }
            Attendance attendance = new Attendance();
            attendance.setMember(member);
            attendance.setActivity(activity);
            attendance.setPresent(false);
            attendanceRepository.save(attendance);
        }
    }

    /**
     * A single combined attendance table across many activities - the
     * "collective presence sheet" for a department's space (Marketing,
     * Sponsoring) when a department is given, or across every activity for
     * every team when it isn't (the SG's space).
     */
    @Transactional(readOnly = true)
    public List<AttendanceDto> getCollective(MemberDepartment department) {
        List<Activity> activities = department == null
                ? activityRepository.findAllByOrderByActivityDateDesc()
                : activityRepository.findAllByScopeTypeAndScopeDepartmentOrderByActivityDateDesc(
                        ActivityScope.DEPARTMENT, department);

        return activities.stream()
                .flatMap(activity -> getForActivity(activity.getId()).stream())
                .toList();
    }

    private List<Member> resolveAudience(Activity activity) {
        return switch (activity.getScopeType()) {
            case ALL -> memberRepository.findAllByActiveTrueOrderByFullNameAsc();
            case DEPARTMENT -> memberRepository.findAllByActiveTrueAndDepartmentOrderByFullNameAsc(
                    activity.getScopeDepartment());
            case PROJECT -> activity.getScopeProject() == null
                    ? List.of()
                    : memberRepository.findAllByActiveTrueAndProjects_IdOrderByFullNameAsc(
                            activity.getScopeProject().getId());
        };
    }
}
