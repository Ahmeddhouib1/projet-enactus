package org.enactusensi.platform;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.List;
import org.enactusensi.platform.dto.member.ActivityRequest;
import org.enactusensi.platform.dto.member.AttendanceBulkRequest;
import org.enactusensi.platform.dto.member.AttendanceEntryRequest;
import org.enactusensi.platform.dto.member.MemberRequest;
import org.enactusensi.platform.dto.project.ProjectRequest;
import org.enactusensi.platform.entity.ActivityScope;
import org.enactusensi.platform.entity.ActivityType;
import org.enactusensi.platform.entity.MemberDepartment;
import org.enactusensi.platform.entity.ProjectPhase;
import org.enactusensi.platform.entity.ProjectStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WithMockUser(username = "admin@test.local", roles = "ADMIN")
class MemberSpaceAdminControllerTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createMemberWithProjectTeamAndDepartment() throws Exception {
        ProjectRequest projectRequest = new ProjectRequest(
                "Clean Water Initiative", "short", "full", null, null, null, null, null, null, "Water",
                ProjectStatus.ACTIVE, ProjectPhase.PROBLEMATIQUE, null, null, false, 0);
        String projectBody = mockMvc.perform(post("/api/admin/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long projectId = objectMapper.readTree(projectBody).get("id").asLong();

        MemberRequest memberRequest = new MemberRequest(
                "Sami Ben Ali", "sami.benali@example.com", "+21600000000", null,
                MemberDepartment.MARKETING, "Project Manager", true, List.of(projectId));

        mockMvc.perform(post("/api/admin/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(memberRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.fullName", is("Sami Ben Ali")))
                .andExpect(jsonPath("$.department", is("MARKETING")))
                .andExpect(jsonPath("$.projects[0].name", is("Clean Water Initiative")));

        mockMvc.perform(get("/api/admin/members").param("projectId", String.valueOf(projectId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].fullName", is("Sami Ben Ali")));
    }

    @Test
    void duplicateMemberEmailIsRejected() throws Exception {
        MemberRequest request = new MemberRequest(
                "Yassine Trabelsi", "yassine@example.com", null, null, MemberDepartment.SPONSORING, null, true, null);

        mockMvc.perform(post("/api/admin/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/admin/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    void attendanceLifecycleForAnActivity() throws Exception {
        MemberRequest memberRequest = new MemberRequest(
                "Nadia Ferjani", "nadia.ferjani@example.com", null, null, MemberDepartment.SPONSORING, null, true, null);
        String memberBody = mockMvc.perform(post("/api/admin/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(memberRequest)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long memberId = objectMapper.readTree(memberBody).get("id").asLong();

        ActivityRequest activityRequest = new ActivityRequest(
                ActivityType.WORKSHOP, "Design Thinking Workshop", LocalDate.now(), "desc",
                ActivityScope.ALL, null, null);
        String activityBody = mockMvc.perform(post("/api/admin/activities")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(activityRequest)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long activityId = objectMapper.readTree(activityBody).get("id").asLong();

        // Creating the activity immediately seeds the member's presence sheet -
        // it must not stay empty until someone explicitly saves attendance.
        mockMvc.perform(get("/api/admin/members/" + memberId + "/attendance"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].activityTitle", is("Design Thinking Workshop")))
                .andExpect(jsonPath("$[0].present", is(false)));

        // Before taking attendance, the member shows up as not present by default.
        mockMvc.perform(get("/api/admin/activities/" + activityId + "/attendance"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.memberId == " + memberId + ")].present", is(List.of(false))));

        AttendanceBulkRequest bulkRequest = new AttendanceBulkRequest(
                List.of(new AttendanceEntryRequest(memberId, true, "Arrived on time, great participation")));

        mockMvc.perform(put("/api/admin/activities/" + activityId + "/attendance")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bulkRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.memberId == " + memberId + ")].present", is(List.of(true))));

        mockMvc.perform(get("/api/admin/members/" + memberId + "/attendance"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].activityTitle", is("Design Thinking Workshop")))
                .andExpect(jsonPath("$[0].remark", is("Arrived on time, great participation")));

        mockMvc.perform(delete("/api/admin/activities/" + activityId))
                .andExpect(status().isNoContent());
    }

    @Test
    void activityScopedToDepartmentOnlyListsThatDepartment() throws Exception {
        mockMvc.perform(post("/api/admin/members")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new MemberRequest(
                        "Marketing Member", "marketing.member@example.com", null, null,
                        MemberDepartment.MARKETING, null, true, null))));
        mockMvc.perform(post("/api/admin/members")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new MemberRequest(
                        "Sponsoring Member", "sponsoring.member@example.com", null, null,
                        MemberDepartment.SPONSORING, null, true, null))));

        ActivityRequest activityRequest = new ActivityRequest(
                ActivityType.MEETING, "Marketing Sync", LocalDate.now(), null,
                ActivityScope.DEPARTMENT, MemberDepartment.MARKETING, null);
        String activityBody = mockMvc.perform(post("/api/admin/activities")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(activityRequest)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long activityId = objectMapper.readTree(activityBody).get("id").asLong();

        mockMvc.perform(get("/api/admin/activities/" + activityId + "/attendance"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", org.hamcrest.Matchers.hasSize(1)))
                .andExpect(jsonPath("$[0].memberFullName", is("Marketing Member")));
    }

    @Test
    void presenceEntryCanBeUpdatedDirectlyFromTheMemberPage() throws Exception {
        MemberRequest memberRequest = new MemberRequest(
                "Karim Jendoubi", "karim.jendoubi@example.com", null, null, MemberDepartment.MARKETING, null, true, null);
        String memberBody = mockMvc.perform(post("/api/admin/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(memberRequest)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long memberId = objectMapper.readTree(memberBody).get("id").asLong();

        ActivityRequest activityRequest = new ActivityRequest(
                ActivityType.FORMATION, "Leadership Formation", LocalDate.now(), null,
                ActivityScope.ALL, null, null);
        String activityBody = mockMvc.perform(post("/api/admin/activities")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(activityRequest)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long activityId = objectMapper.readTree(activityBody).get("id").asLong();

        mockMvc.perform(put("/api/admin/members/" + memberId + "/attendance/" + activityId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"present\":true,\"remark\":\"Led a session\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.present", is(true)))
                .andExpect(jsonPath("$.remark", is("Led a session")));

        mockMvc.perform(get("/api/admin/members/" + memberId + "/attendance"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].present", is(true)))
                .andExpect(jsonPath("$[0].remark", is("Led a session")));
    }

    @Test
    void activityWithDepartmentScopeButNoDepartmentIsRejected() throws Exception {
        ActivityRequest activityRequest = new ActivityRequest(
                ActivityType.MEETING, "Broken Scope", LocalDate.now(), null,
                ActivityScope.DEPARTMENT, null, null);

        mockMvc.perform(post("/api/admin/activities")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(activityRequest)))
                .andExpect(status().isBadRequest());
    }
}
