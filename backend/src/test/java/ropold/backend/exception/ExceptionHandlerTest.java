package ropold.backend.exception;

import com.cloudinary.Cloudinary;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import ropold.backend.repository.CountryRepository;
import ropold.backend.service.CountryService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private Cloudinary cloudinary;

    @Autowired
    private CountryRepository countryRepository;

    @MockBean
    private CountryService countryService;

    @Test
    void whenCountryNotFoundException_thenReturnsNotFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/world-quartet-hub/{id}", "non-existing-id"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("No Country found with id: non-existing-id"));
    }

    @Test
    void whenRuntimeException_thenReturnsInternalServerError() throws Exception {
        when(countryService.getCountryById(any())).thenThrow(new RuntimeException("Unexpected error"));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/world-quartet-hub/{id}", "any-id"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Unexpected error"));

    }

    @Test
    @WithMockUser(username = "user")
    void whenAccessDeniedException_thenReturnsForbidden() throws Exception {
        when(countryService.getCountryById(any())).thenThrow(new AccessDeniedException("Access denied"));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/world-quartet-hub/{id}", "any-id"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Access denied"));
    }

}
