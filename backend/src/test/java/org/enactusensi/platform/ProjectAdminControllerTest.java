package org.enactusensi.platform;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.enactusensi.platform.dto.project.ProjectRequest;
import org.enactusensi.platform.entity.ProjectPhase;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WithMockUser(username = "admin@test.local", roles = "ADMIN")
class ProjectAdminControllerTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createProjectGeneratesUniqueSlug() throws Exception {
        ProjectRequest request = new ProjectRequest(
                "Solar Kits for Rural Schools", "short desc", "full desc", "context", "solution",
                "impact", "objectives", null, null, "Energy",
                org.enactusensi.platform.entity.ProjectStatus.IDEA, ProjectPhase.PROBLEMATIQUE, null, null, false, 0);

        mockMvc.perform(post("/api/admin/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.slug", org.hamcrest.Matchers.is("solar-kits-for-rural-schools")))
                .andExpect(jsonPath("$.name", org.hamcrest.Matchers.is("Solar Kits for Rural Schools")));
    }

    @Test
    void createProjectWithoutNameReturnsBadRequest() throws Exception {
        ProjectRequest request = new ProjectRequest(
                "", null, null, null, null, null, null, null, null, null,
                org.enactusensi.platform.entity.ProjectStatus.IDEA, ProjectPhase.PROBLEMATIQUE, null, null, false, 0);

        mockMvc.perform(post("/api/admin/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.name").exists());
    }

    @Test
    void updateAndDeleteProjectLifecycle() throws Exception {
        ProjectRequest createRequest = new ProjectRequest(
                "Water Access Initiative", "short", "full", null, null, null, null, null, null, "Water",
                org.enactusensi.platform.entity.ProjectStatus.IDEA, ProjectPhase.PROBLEMATIQUE, null, null, false, 0);

        String createBody = mockMvc.perform(post("/api/admin/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long id = objectMapper.readTree(createBody).get("id").asLong();

        ProjectRequest updateRequest = new ProjectRequest(
                "Water Access Initiative", "updated short", "full", null, null, null, null, null, null, "Water",
                org.enactusensi.platform.entity.ProjectStatus.ACTIVE, ProjectPhase.PILOT_STEP_1, null, null, true, 0);

        mockMvc.perform(put("/api/admin/projects/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", org.hamcrest.Matchers.is("ACTIVE")))
                .andExpect(jsonPath("$.featured", org.hamcrest.Matchers.is(true)));

        mockMvc.perform(delete("/api/admin/projects/" + id))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/admin/projects/" + id))
                .andExpect(status().isNotFound());
    }

    @Test
    void archivedProjectIsHiddenFromPublicApi() throws Exception {
        ProjectRequest createRequest = new ProjectRequest(
                "Old Retired Project", "short", "full", null, null, null, null, null, null, "Legacy",
                org.enactusensi.platform.entity.ProjectStatus.ARCHIVED, ProjectPhase.PROBLEMATIQUE, null, null, false, 0);

        String createBody = mockMvc.perform(post("/api/admin/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        String slug = objectMapper.readTree(createBody).get("slug").asText();

        mockMvc.perform(get("/api/public/projects/" + slug).with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.anonymous()))
                .andExpect(status().isNotFound());
    }
}
