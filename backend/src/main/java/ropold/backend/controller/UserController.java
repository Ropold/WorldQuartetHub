package ropold.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import ropold.backend.model.CountryModel;
import ropold.backend.service.AppUserService;
import ropold.backend.service.CountryService;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final CountryService countryService;
    private final AppUserService appUserService;

    @GetMapping(value = "/me", produces = "text/plain")
    public String getMe() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/me/details")
    public Map<String, Object> getUserDetails(@AuthenticationPrincipal OAuth2User user) {
        if (user == null) {
            return Map.of("message", "User not authenticated");
        }
        return user.getAttributes();
    }

    @GetMapping("/favorites")
    public List<CountryModel> getUserFavorites(@AuthenticationPrincipal OAuth2User authentication) {
        List<String> favoritePieceImageIds = appUserService.getUserFavoriteCountries(authentication.getName());
        return countryService.getCountriesByIds(favoritePieceImageIds);
    }

    @GetMapping("/me/my-countries/{githubId}")
    public List<CountryModel> getCountriesForGithubUser(@PathVariable String githubId) {
        return countryService.getCountriesForGithubUser(githubId);
    }

    @PostMapping("/favorites/{countryId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void addCountryToFavorites(@PathVariable String countryId, @AuthenticationPrincipal OAuth2User authentication) {
        String authenticatedUserId = authentication.getName();
        appUserService.addCountryToFavoriteCountries(authenticatedUserId, countryId);
    }

    @DeleteMapping("/favorites/{countryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeCountryFromFavorites(@PathVariable String countryId, @AuthenticationPrincipal OAuth2User authentication) {
        String authenticatedUserId = authentication.getName();
        appUserService.removeCountryFromFavoriteCountries(authenticatedUserId, countryId);
    }


}
