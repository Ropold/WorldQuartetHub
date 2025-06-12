package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.model.AppUser;
import ropold.backend.repository.AppUserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppUserService {

    private final AppUserRepository appUserRepository;

    public AppUser getUserById(String userId) {
        return appUserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<String> getUserFavoriteCountries(String userId) {
        AppUser user = getUserById(userId);
        return user.favoriteCountries();
    }

    public void addCountryToFavoriteCountries(String authenticatedUserId, String countryId) {
        AppUser user = getUserById(authenticatedUserId);

        if (!user.favoriteCountries().contains(countryId)) {
            user.favoriteCountries().add(countryId);
            appUserRepository.save(user);
        }
    }

    public void removeCountryFromFavoriteCountries(String authenticatedUserId, String countryId) {
        AppUser user = getUserById(authenticatedUserId);

        if (user.favoriteCountries().contains(countryId)) {
            user.favoriteCountries().remove(countryId);
            appUserRepository.save(user);
        }
    }
}
