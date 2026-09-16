package org.enactusensi.platform;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.enactusensi.platform.dto.member.MemberRequest;
import org.enactusensi.platform.entity.MemberDepartment;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WithMockUser(username = "admin@test.local", roles = "ADMIN")
class PmSpaceTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void firstUseSetsPasswordThenSubsequentVisitsVerifyIt() throws Exception {
        MemberRequest memberRequest = new MemberRequest(
                "PM Candidate", "pm.candidate@example.com", null, null, MemberDepartment.MARKETING,
                "Project Manager", true, null);
        String body = mockMvc.perform(post("/api/admin/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(memberRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.hasPmPassword", is(false)))
                .andReturn().getResponse().getContentAsString();
        long memberId = objectMapper.readTree(body).get("id").asLong();

        // First use: set the password.
        mockMvc.perform(post("/api/admin/members/" + memberId + "/pm-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"password\":\"secret123\"}"))
                .andExpect(status().isCreated());

        // Setting it again is rejected - only allowed once.
        mockMvc.perform(post("/api/admin/members/" + memberId + "/pm-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"password\":\"other123\"}"))
                .andExpect(status().isBadRequest());

        // Wrong password fails verification.
        mockMvc.perform(post("/api/admin/members/" + memberId + "/pm-password/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"password\":\"wrong\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid", is(false)));

        // Correct password succeeds.
        mockMvc.perform(post("/api/admin/members/" + memberId + "/pm-password/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"password\":\"secret123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid", is(true)));

        // Admin can reset it, after which it can be set again.
        mockMvc.perform(delete("/api/admin/members/" + memberId + "/pm-password"))
                .andExpect(status().isNoContent());
        mockMvc.perform(post("/api/admin/members/" + memberId + "/pm-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"password\":\"brandnew123\"}"))
                .andExpect(status().isCreated());
    }

    @Test
    void memberRoleIsExposedForFilteringTheProjectSpacePicker() throws Exception {
        mockMvc.perform(post("/api/admin/members")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new MemberRequest(
                        "Regular Contributor", "regular.contributor@example.com", null, null,
                        MemberDepartment.SPONSORING, "Contributor", true, null))));
        mockMvc.perform(post("/api/admin/members")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new MemberRequest(
                        "Head of Projects", "head.of.projects@example.com", null, null,
                        MemberDepartment.MARKETING, "Project Manager", true, null))));

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/admin/members"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.fullName == 'Head of Projects')].role", is(java.util.List.of("Project Manager"))))
                .andExpect(jsonPath("$[?(@.fullName == 'Regular Contributor')].role", is(java.util.List.of("Contributor"))));
    }

    @Test
    void departmentIsOptionalForRolesThatAreNeitherMarketingNorSponsoring() throws Exception {
        MemberRequest request = new MemberRequest(
                "Board Team Leader", "board.team.leader@example.com", null, null,
                null, "Team Leader", true, null);

        mockMvc.perform(post("/api/admin/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.department", org.hamcrest.Matchers.nullValue()));
    }
}
