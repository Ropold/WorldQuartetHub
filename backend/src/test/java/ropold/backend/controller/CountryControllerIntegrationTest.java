package ropold.backend.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import ropold.backend.model.AppUser;
import ropold.backend.model.CountryModel;
import ropold.backend.repository.AppUserRepository;
import ropold.backend.repository.CountryRepository;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CountryControllerIntegrationTest {

    @MockBean
    private Cloudinary cloudinary;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private CountryRepository countryRepository;

    @BeforeEach
    void setUp() {
        appUserRepository.deleteAll();
        countryRepository.deleteAll();

        AppUser user = new AppUser(
                "user",
                "username",
                "Max Mustermann",
                "https://github.com/avatar",
                "https://github.com/mustermann",
                List.of("2")
        );
        appUserRepository.save(user);

        CountryModel countryModel1 = new CountryModel(
                "1",
                "Deutschland",
                "Berlin",
                83.2,
                233,
                3769000,
                51600,
                33,
                357582,
                644480,
                8.5,
                700,
                "user",
                "http://example.com/country1.jpg"
        );

        CountryModel countryModel2 = new CountryModel(
                "2",
                "Frankreich",
                "Paris",
                67.5,
                122,
                2161000,
                43500,
                31,
                551695,
                1040000,
                11.7,
                850,
                "user",
                "http://example.com/country2.jpg"
        );

        countryRepository.saveAll(List.of(countryModel1, countryModel2));
    }

    @Test
    void testGetAllCountries_shouldReturnAllCountries() throws Exception {
        mockMvc.perform(get("/api/world-quartet-hub"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].countryName").value("Deutschland"))
                .andExpect(jsonPath("$[1].countryName").value("Frankreich"));
    }

    @Test
    void testDealUserAndCpuCards_shouldReturnUserAndCpuCards() throws Exception {
        mockMvc.perform(get("/api/world-quartet-hub/deal/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user").isArray())
                .andExpect(jsonPath("$.cpu").isArray())
                .andExpect(jsonPath("$.user.length()").value(1))
                .andExpect(jsonPath("$.cpu.length()").value(1))
                .andExpect(jsonPath("$.user[0].countryName").exists())
                .andExpect(jsonPath("$.cpu[0].countryName").exists());
    }

    @Test
    void testGetCountryById_shouldReturnCountry() throws Exception {
        mockMvc.perform(get("/api/world-quartet-hub/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.countryName").value("Deutschland"));
    }

    @Test
    void testGetCountryByName_shouldReturnCountry() throws Exception {
        mockMvc.perform(get("/api/world-quartet-hub/country/frankreich"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.countryName").value("Frankreich"));
    }

    @Test
    void testGetCountryById_shouldReturnNotFound() throws Exception {
        mockMvc.perform(get("/api/world-quartet-hub/999"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Country not found"));
    }

    @Test
    void testPostCountry_shouldCreateCountry() throws Exception {
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("user");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockOAuth2User, null,
                        Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")))
        );
        countryRepository.deleteAll();

        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.upload(any(), anyMap())).thenReturn(Map.of("secure_url", "https://www.test.de/"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/world-quartet-hub")
                        .file(new MockMultipartFile("image", "image.jpg", "image/jpeg", "image".getBytes()))
                        .file(new MockMultipartFile("countryModel", "", "application/json", """
                        {
                          "countryName": "Japan",
                          "capitalCity": "Tokio",
                          "populationInMillions": 125.8,
                          "populationDensityPerKm2": 347,
                          "capitalCityPopulation": 13960000,
                          "gdpPerCapitaInUSD": 6300,
                          "forestAreaPercentage": 68,
                          "totalAreaInKm2": 377975,
                          "roadNetworkLengthInKm": 1210000,
                          "averageAnnualTemperatureInC": 15.2,
                          "annualPrecipitationInMm": 1670,
                          "githubId": "user",
                          "imageUrl": "https://example.com/japan.jpg"
                        }
                    """.getBytes())))
                .andExpect(status().isCreated());

        // Validate question was saved
        List<CountryModel> allCountries = countryRepository.findAll();
        Assertions.assertEquals(1, allCountries.size());

        CountryModel savedCountry = allCountries.getFirst();
        org.assertj.core.api.Assertions.assertThat(savedCountry)
                .usingRecursiveComparison()
                .ignoringFields("id", "imageUrl")
                .isEqualTo(new CountryModel(
                        null,
                        "Japan",
                        "Tokio",
                        125.8,
                        347,
                        13960000,
                        6300,
                        68,
                        377975,
                        1210000,
                        15.2,
                        1670,
                        "user",
                        null
                ));
    }

    @Test
    void testPostCountryNoLogin_shouldCreateCountry() throws Exception {
        countryRepository.deleteAll();

        mockMvc.perform(MockMvcRequestBuilders.post("/api/world-quartet-hub/no-login")
                        .contentType("application/json")
                        .content("""
                {
                  "id": null,
                  "countryName": "Japan",
                  "capitalCity": "Tokio",
                  "populationInMillions": 125.8,
                  "populationDensityPerKm2": 347,
                  "capitalCityPopulation": 13960000,
                  "gdpPerCapitaInUSD": 6300,
                  "forestAreaPercentage": 68,
                  "totalAreaInKm2": 377975,
                  "roadNetworkLengthInKm": 1210000,
                  "averageAnnualTemperatureInC": 15.2,
                  "annualPrecipitationInMm": 1670,
                  "githubId": "user",
                  "imageUrl": null
                }
            """))
                .andExpect(status().isCreated());

        List<CountryModel> allCountries = countryRepository.findAll();
        Assertions.assertEquals(1, allCountries.size());

        CountryModel savedCountry = allCountries.getFirst();
        org.assertj.core.api.Assertions.assertThat(savedCountry)
                .usingRecursiveComparison()
                .ignoringFields("id", "imageUrl")
                .isEqualTo(new CountryModel(
                        null,
                        "Japan",
                        "Tokio",
                        125.8,
                        347,
                        13960000,
                        6300,
                        68,
                        377975,
                        1210000,
                        15.2,
                        1670,
                        "user",
                        null
                ));
    }

    @Test
    void updateCountryWithPut_shouldReturnUpdatedCountry() throws Exception {
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("user");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockOAuth2User, null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")))
        );

        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.upload(any(), anyMap())).thenReturn(Map.of("secure_url", "https://example.com/updated-image.jpg"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/world-quartet-hub/1")
                        .file(new MockMultipartFile("image", "image.jpg", "image/jpeg", "image".getBytes()))
                        .file(new MockMultipartFile("countryModel", "", "application/json", """
                        {
                          "id": "1",
                          "countryName": "Japan Updated",
                          "capitalCity": "Tokio",
                          "populationInMillions": 130.0,
                          "populationDensityPerKm2": 350,
                          "capitalCityPopulation": 14000000,
                          "gdpPerCapitaInUSD": 7000,
                          "forestAreaPercentage": 70,
                          "totalAreaInKm2": 380000,
                          "roadNetworkLengthInKm": 1220000,
                          "averageAnnualTemperatureInC": 16.0,
                          "annualPrecipitationInMm": 1700,
                          "githubId": "user",
                          "imageUrl": "https://example.com/updated-image.jpg"
                        }
                    """.getBytes()))
                        .contentType("multipart/form-data")
                        .with(request -> {
                            request.setMethod("PUT");
                            return request;
                        }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.countryName").value("Japan Updated"))
                .andExpect(jsonPath("$.populationInMillions").value(130.0))
                .andExpect(jsonPath("$.gdpPerCapitaInUSD").value(7000))
                .andExpect(jsonPath("$.imageUrl").value("https://example.com/updated-image.jpg"));

        CountryModel updated = countryRepository.findById("1").orElseThrow();
        Assertions.assertEquals("Japan Updated", updated.countryName());
        Assertions.assertEquals(130.0, updated.populationInMillions());
        Assertions.assertEquals(7000, updated.gdpPerCapitaInUSD());
        Assertions.assertEquals("https://example.com/updated-image.jpg", updated.imageUrl());
    }

    @Test
    void deleteCountry_shouldReturnNoContent() throws Exception {
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("user");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockOAuth2User, null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")))
        );

        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.upload(any(), anyMap())).thenReturn(Map.of("secure_url", "https://example.com/updated-image.jpg"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/world-quartet-hub/1"))
                .andExpect(status().isNoContent());
        Assertions.assertFalse(countryRepository.existsById("1"));
    }


    @Test
    void updateQuestion_withoutImage_shouldSetImageUrlNull() throws Exception {
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("user");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockOAuth2User, null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")))
        );

        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.upload(any(), anyMap())).thenReturn(Map.of("secure_url", "https://example.com/updated-image.jpg"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/world-quartet-hub/2")
                        .file(new MockMultipartFile("countryModel", "", "application/json", """
                        {
                          "id": "2",
                          "countryName": "Frankreich Updated",
                          "capitalCity": "Paris",
                          "populationInMillions": 68.0,
                          "populationDensityPerKm2": 125,
                          "capitalCityPopulation": 2200000,
                          "gdpPerCapitaInUSD": 45000,
                          "forestAreaPercentage": 32,
                          "totalAreaInKm2": 552000,
                          "roadNetworkLengthInKm": 1050000,
                          "averageAnnualTemperatureInC": 12.0,
                          "annualPrecipitationInMm": 900,
                          "githubId": "user",
                          "imageUrl": null
                        }
                    """.getBytes()))
                        .contentType("multipart/form-data")
                        .with(request -> {
                            request.setMethod("PUT");
                            return request;
                        }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.imageUrl").value(Matchers.nullValue()));

        CountryModel updated = countryRepository.findById("2").orElseThrow();
        Assertions.assertNull(updated.imageUrl());
    }
}
