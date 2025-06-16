package ropold.backend.controller;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import ropold.backend.model.AppUser;
import ropold.backend.model.CountryModel;
import ropold.backend.repository.AppUserRepository;
import ropold.backend.repository.CountryRepository;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AppUserControllerTest {

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
    void testGetMe_withLoggedInUser_expectUsername() throws Exception {
        OAuth2User mockUser = mock(OAuth2User.class);
        when(mockUser.getName()).thenReturn("user");

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        Authentication authentication = new UsernamePasswordAuthenticationToken(mockUser, null, mockUser.getAuthorities());
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(content().string("user"));
    }

    @Test
    void testGetMe_withoutLogin_expectAnonymousUsername() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(content().string("anonymousUser"));
    }

    @Test
    void testGetUserDetails_withLoggedInUser_expectUserDetails() throws Exception {
        // Erstellen eines Mock OAuth2User
        OAuth2User mockUser = mock(OAuth2User.class);
        when(mockUser.getAttributes()).thenReturn(Map.of(
                "login", "username",
                "name", "max mustermann",
                "avatar_url", "https://github.com/avatar",
                "html_url", "https://github.com/mustermann"
        ));

        // Simuliere den OAuth2User in der SecurityContext
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        Authentication authentication = new UsernamePasswordAuthenticationToken(mockUser, null, mockUser.getAuthorities());
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        mockMvc.perform(get("/api/users/me/details"))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                {
                    "login": "username",
                    "name": "max mustermann",
                    "avatar_url": "https://github.com/avatar",
                    "html_url": "https://github.com/mustermann"
                }
            """));
    }

    @Test
    void testGetUserDetails_withoutLogin_expectErrorMessage() throws Exception {
        mockMvc.perform(get("/api/users/me/details"))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                {
                    "message": "User not authenticated"
                }
            """));
    }

    @Test
    void TestGetUserFavorites_ShouldReturnUserFavorites() throws Exception {
        mockMvc.perform(get("/api/users/favorites")
                        .with(oidcLogin().idToken(i -> i.claim("sub", "user"))))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                [{
                    "id":"2",
                    "countryName":"Frankreich",
                    "capitalCity":"Paris",
                    "populationInMillions":67.5,
                    "populationDensityPerKm2":122,
                    "capitalCityPopulation":2161000,
                    "gdpPerCapitaInUSD":43500,
                    "forestAreaPercentage":31,
                    "totalAreaInKm2":551695,
                    "roadNetworkLengthInKm":1040000,
                    "averageAnnualTemperatureInC":11.7,
                    "annualPrecipitationInMm":850,
                    "githubId":"user",
                    "imageUrl":"http://example.com/country2.jpg"
                }]
            """, true));
    }

    @Test
    void getUserFavorites_shouldReturnUserFavorites() throws Exception {
        mockMvc.perform(get("/api/users/favorites")
                        .with(oidcLogin().idToken(i -> i.claim("sub", "user"))))
                .andExpect(status().isOk())
                .andExpect(content().json("""
            [{
                "id":"2",
                "countryName":"Frankreich",
                "capitalCity":"Paris",
                "populationInMillions":67.5,
                "populationDensityPerKm2":122,
                "capitalCityPopulation":2161000,
                "gdpPerCapitaInUSD":43500,
                "forestAreaPercentage":31,
                "totalAreaInKm2":551695,
                "roadNetworkLengthInKm":1040000,
                "averageAnnualTemperatureInC":11.7,
                "annualPrecipitationInMm":850,
                "githubId":"user",
                "imageUrl":"http://example.com/country2.jpg"
            }]
            """, true));
    }

    @Test
    void addQuestionToFavorites_shouldAddQuestionAndReturnFavorites() throws Exception {
        AppUser userBefore = appUserRepository.findById("user").orElseThrow();
        Assertions.assertFalse(userBefore.favoriteCountries().contains("1"));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/users/favorites/1")
                        .with(oidcLogin().idToken(i -> i.claim("sub", "user"))))
                .andExpect(status().isCreated());

        AppUser updatedUser = appUserRepository.findById("user").orElseThrow();
        Assertions.assertTrue(updatedUser.favoriteCountries().contains("1"));
    }

    @Test
    void removeQuestionFromFavorites_shouldRemoveQuestionAndReturnFavorites() throws Exception {
        AppUser userBefore = appUserRepository.findById("user").orElseThrow();
        Assertions.assertTrue(userBefore.favoriteCountries().contains("2"));

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/users/favorites/2")
                        .with(oidcLogin().idToken(i -> i.claim("sub", "user")))
                )
                .andExpect(status().isNoContent()); // .isOk = 200, .isNoContent = 204

        AppUser updatedUser = appUserRepository.findById("user").orElseThrow();
        Assertions.assertFalse(updatedUser.favoriteCountries().contains("2"));
    }
}
