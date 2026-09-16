package org.enactusensi.platform;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.enactusensi.platform.dto.partner.PartnerRequest;
import org.enactusensi.platform.entity.PartnerType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WithMockUser(username = "admin@test.local", roles = "ADMIN")
class PartnerAdminControllerTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void fullCrudLifecycle() throws Exception {
        PartnerRequest createRequest = new PartnerRequest(
                "Acme Corp", "/uploads/partners/acme.png", "https://acme.example", "desc",
                PartnerType.SPONSOR, 0, true);

        String body = mockMvc.perform(post("/api/admin/partners")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is("Acme Corp")))
                .andReturn().getResponse().getContentAsString();
        long id = objectMapper.readTree(body).get("id").asLong();

        PartnerRequest updateRequest = new PartnerRequest(
                "Acme Corporation", "/uploads/partners/acme.png", "https://acme.example", "updated desc",
                PartnerType.TECHNOLOGY, 1, false);

        mockMvc.perform(put("/api/admin/partners/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Acme Corporation")))
                .andExpect(jsonPath("$.partnerType", is("TECHNOLOGY")))
                .andExpect(jsonPath("$.active", is(false)));

        mockMvc.perform(get("/api/public/partners"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", org.hamcrest.Matchers.not(
                        org.hamcrest.Matchers.hasItem(org.hamcrest.Matchers.hasEntry("name", "Acme Corporation")))));

        mockMvc.perform(delete("/api/admin/partners/" + id))
                .andExpect(status().isNoContent());
    }

    @Test
    void createPartnerWithoutRequiredFieldsReturnsBadRequest() throws Exception {
        PartnerRequest request = new PartnerRequest("", "", null, null, null, 0, true);

        mockMvc.perform(post("/api/admin/partners")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.name").exists())
                .andExpect(jsonPath("$.fieldErrors.logo").exists())
                .andExpect(jsonPath("$.fieldErrors.partnerType").exists());
    }
}
