package org.enactusensi.platform;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import org.enactusensi.platform.dto.document.DocumentRequest;
import org.enactusensi.platform.dto.member.ActivityRequest;
import org.enactusensi.platform.dto.member.MemberRequest;
import org.enactusensi.platform.dto.project.ProjectRequest;
import org.enactusensi.platform.entity.ActivityScope;
import org.enactusensi.platform.entity.ActivityType;
import org.enactusensi.platform.entity.DocumentScope;
import org.enactusensi.platform.entity.MemberDepartment;
import org.enactusensi.platform.entity.ProjectPhase;
import org.enactusensi.platform.entity.ProjectStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WithMockUser(username = "admin@test.local", roles = "ADMIN")
class DocumentAndCollectiveAttendanceTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void generalDocumentLifecycle() throws Exception {
        DocumentRequest request = new DocumentRequest(
                "Sponsorship Deck", "/uploads/documents/deck.pdf", DocumentScope.GENERAL, null, null, "For all responsables");

        String body = mockMvc.perform(post("/api/admin/documents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("Sponsorship Deck")))
                .andReturn().getResponse().getContentAsString();
        long id = objectMapper.readTree(body).get("id").asLong();

        mockMvc.perform(get("/api/admin/documents").param("scope", "GENERAL"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title", is("Sponsorship Deck")));

        mockMvc.perform(delete("/api/admin/documents/" + id))
                .andExpect(status().isNoContent());
    }

    @Test
    void projectScopedDocumentRequiresAndUsesProjectId() throws Exception {
        ProjectRequest projectRequest = new ProjectRequest(
                "Recycling Hub", "short", "full", null, null, null, null, null, null, "Environment",
                ProjectStatus.ACTIVE, ProjectPhase.IDEA_STEP_1, null, null, false, 0);
        String projectBody = mockMvc.perform(post("/api/admin/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.phase", is("IDEA_STEP_1")))
                .andReturn().getResponse().getContentAsString();
        long projectId = objectMapper.readTree(projectBody).get("id").asLong();

        DocumentRequest missingProjectId = new DocumentRequest(
                "Business Plan", "/uploads/documents/plan.pdf", DocumentScope.PROJECT, null, null, null);
        mockMvc.perform(post("/api/admin/documents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(missingProjectId)))
                .andExpect(status().isBadRequest());

        DocumentRequest validRequest = new DocumentRequest(
                "Business Plan", "/uploads/documents/plan.pdf", DocumentScope.PROJECT, projectId, ProjectPhase.IDEA_STEP_1, null);
        mockMvc.perform(post("/api/admin/documents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.projectId", is(projectId), Long.class))
                .andExpect(jsonPath("$.phase", is("IDEA_STEP_1")));

        mockMvc.perform(get("/api/admin/documents").param("projectId", String.valueOf(projectId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title", is("Business Plan")))
                .andExpect(jsonPath("$[0].phase", is("IDEA_STEP_1")));
    }

    @Test
    void collectiveAttendanceScopesToDepartmentOrEverything() throws Exception {
        mockMvc.perform(post("/api/admin/members")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new MemberRequest(
                        "Collective Marketing", "collective.marketing@example.com", null, null,
                        MemberDepartment.MARKETING, null, true, null))));
        mockMvc.perform(post("/api/admin/members")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new MemberRequest(
                        "Collective Sponsoring", "collective.sponsoring@example.com", null, null,
                        MemberDepartment.SPONSORING, null, true, null))));

        mockMvc.perform(post("/api/admin/activities")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new ActivityRequest(
                        ActivityType.MEETING, "Marketing Kickoff", LocalDate.now(), null,
                        ActivityScope.DEPARTMENT, MemberDepartment.MARKETING, null))));

        // Marketing's collective sheet only has the marketing member.
        mockMvc.perform(get("/api/admin/attendance/collective").param("department", "MARKETING"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", org.hamcrest.Matchers.hasSize(1)))
                .andExpect(jsonPath("$[0].memberFullName", is("Collective Marketing")));

        // SG's collective sheet (no department filter) sees it too, across every team.
        mockMvc.perform(get("/api/admin/attendance/collective"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.memberFullName == 'Collective Marketing')]").exists());
    }
}
