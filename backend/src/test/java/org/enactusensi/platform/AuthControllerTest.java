package org.enactusensi.platform;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.enactusensi.platform.entity.AdminRole;
import org.enactusensi.platform.entity.AdminUser;
import org.enactusensi.platform.repository.AdminUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

class AuthControllerTest extends AbstractIntegrationTest {

    private static final String EMAIL = "admin@test.local";
    private static final String PASSWORD = "TestPassword123";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void seedAdmin() {
        if (adminUserRepository.findByEmailIgnoreCase(EMAIL).isEmpty()) {
            AdminUser user = new AdminUser();
            user.setEmail(EMAIL);
            user.setPasswordHash(passwordEncoder.encode(PASSWORD));
            user.setRole(AdminRole.ROLE_ADMIN);
            adminUserRepository.save(user);
        }
    }

    @Test
    void loginWithValidCredentialsReturnsToken() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginPayload(EMAIL, PASSWORD))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.email", is(EMAIL)))
                .andExpect(jsonPath("$.role", is("ROLE_ADMIN")));
    }

    @Test
    void loginWithWrongPasswordReturnsUnauthorized() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginPayload(EMAIL, "wrong-password"))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void meWithoutTokenReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void meWithValidTokenReturnsCurrentAdmin() throws Exception {
        String token = login();

        mockMvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is(EMAIL)))
                .andExpect(jsonPath("$.role", is("ROLE_ADMIN")));
    }

    @Test
    void adminEndpointWithoutTokenReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void adminEndpointWithValidTokenReturnsOk() throws Exception {
        String token = login();

        mockMvc.perform(get("/api/admin/dashboard").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    private String login() throws Exception {
        String body = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginPayload(EMAIL, PASSWORD))))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(body).get("token").asText();
    }

    private record LoginPayload(String email, String password) {
    }
}
