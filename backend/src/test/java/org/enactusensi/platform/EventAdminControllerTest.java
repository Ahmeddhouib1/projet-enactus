package org.enactusensi.platform;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.enactusensi.platform.dto.event.EventEditionRequest;
import org.enactusensi.platform.dto.event.EventRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WithMockUser(username = "admin@test.local", roles = "ADMIN")
class EventAdminControllerTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createEventGeneratesSlugAndSupportsEditionLifecycle() throws Exception {
        EventRequest eventRequest = new EventRequest("Innovation Summit", "desc", null, true);

        String eventBody = mockMvc.perform(post("/api/admin/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(eventRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.slug", is("innovation-summit")))
                .andReturn().getResponse().getContentAsString();
        long eventId = objectMapper.readTree(eventBody).get("id").asLong();

        EventEditionRequest editionRequest = new EventEditionRequest(
                "Edition 2026", 2026, "desc", null, null, "Tunis", null, 0);

        String editionBody = mockMvc.perform(post("/api/admin/events/" + eventId + "/editions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(editionRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.editionName", is("Edition 2026")))
                .andReturn().getResponse().getContentAsString();
        long editionId = objectMapper.readTree(editionBody).get("id").asLong();

        EventEditionRequest updateRequest = new EventEditionRequest(
                "Edition 2026 - Updated", 2026, "desc updated", null, null, "Tunis, Manouba", null, 0);

        mockMvc.perform(put("/api/admin/events/" + eventId + "/editions/" + editionId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.editionName", is("Edition 2026 - Updated")));

        mockMvc.perform(delete("/api/admin/events/" + eventId + "/editions/" + editionId))
                .andExpect(status().isNoContent());

        mockMvc.perform(delete("/api/admin/events/" + eventId))
                .andExpect(status().isNoContent());
    }

    @Test
    void createEventWithoutNameReturnsBadRequest() throws Exception {
        EventRequest request = new EventRequest("", null, null, false);

        mockMvc.perform(post("/api/admin/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
