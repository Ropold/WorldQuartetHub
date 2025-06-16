package ropold.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ropold.backend.exception.CountryNotFoundException;
import ropold.backend.model.CountryModel;
import ropold.backend.service.CloudinaryService;
import ropold.backend.service.CountryService;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/world-quartet-hub")
@RequiredArgsConstructor
public class CountryController {

    private final CountryService countryService;
    private final CloudinaryService cloudinaryService;

    @GetMapping
    public List<CountryModel> getAllCountries() {
        return countryService.getAllCountries();
    }

    @GetMapping("/deal/{count}")
    public Map<String, List<CountryModel>> dealUserAndCpuCards(@PathVariable int count) {
        List<CountryModel> all = new ArrayList<>(countryService.getAllCountries());
        Collections.shuffle(all);
        int total = Math.min(count * 2, all.size());
        List<CountryModel> selected = all.subList(0, total);
        List<CountryModel> user = selected.subList(0, count);
        List<CountryModel> cpu = selected.subList(count, total);

        Map<String, List<CountryModel>> result = new HashMap<>();
        result.put("user", user);
        result.put("cpu", cpu);
        return result;
    }

    @GetMapping("/{id}")
    public CountryModel getCountryById(@PathVariable String id) {
        CountryModel country = countryService.getCountryById(id);
        if (country == null) {
            throw new CountryNotFoundException("No Country found with id: " + id);
        }
        return country;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping()
    public CountryModel addCountry(
            @RequestPart("countryModel") CountryModel countryModel,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal OAuth2User authentication) throws IOException {

        String authenticatedUserId = authentication.getName();

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = cloudinaryService.uploadImage(image);
        }

        return countryService.addCountry(
                new CountryModel(
                        null,
                        countryModel.countryName(),
                        countryModel.capitalCity(),
                        countryModel.populationInMillions(),
                        countryModel.populationDensityPerKm2(),
                        countryModel.capitalCityPopulation(),
                        countryModel.gdpPerCapitaInUSD(),
                        countryModel.forestAreaPercentage(),
                        countryModel.totalAreaInKm2(),
                        countryModel.roadNetworkLengthInKm(),
                        countryModel.averageAnnualTemperatureInC(),
                        countryModel.annualPrecipitationInMm(),
                        authenticatedUserId,
                        imageUrl
                )
        );
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/no-login")
    public CountryModel addCountryWithNoLogin(
            @RequestBody CountryModel countryModel){

        return countryService.addCountry(
                        new CountryModel(
                                null,
                                countryModel.countryName(),
                                countryModel.capitalCity(),
                                countryModel.populationInMillions(),
                                countryModel.populationDensityPerKm2(),
                                countryModel.capitalCityPopulation(),
                                countryModel.gdpPerCapitaInUSD(),
                                countryModel.forestAreaPercentage(),
                                countryModel.totalAreaInKm2(),
                                countryModel.roadNetworkLengthInKm(),
                                countryModel.averageAnnualTemperatureInC(),
                                countryModel.annualPrecipitationInMm(),
                                countryModel.githubId(),
                                null
                        )
                );
    }

    @PutMapping("/{id}")
    public CountryModel updateCountry(
            @PathVariable String id,
            @RequestPart("countryModel") CountryModel countryModel,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal OAuth2User authentication) throws IOException {

        String authenticatedUserId = authentication.getName();
        CountryModel existingCountry = countryService.getCountryById(id);

        if (!authenticatedUserId.equals(existingCountry.githubId())) {
            throw new AccessDeniedException("You do not have permission to update this country.");
        }

        String newImageUrl;

        if (image != null && !image.isEmpty()) {
            newImageUrl = cloudinaryService.uploadImage(image);
        } else if (countryModel.imageUrl() == null || countryModel.imageUrl().isBlank()) {
            newImageUrl = null;
        } else {
            newImageUrl = existingCountry.imageUrl();
        }

        CountryModel updatedCountry = new CountryModel(
                id,
                countryModel.countryName(),
                countryModel.capitalCity(),
                countryModel.populationInMillions(),
                countryModel.populationDensityPerKm2(),
                countryModel.capitalCityPopulation(),
                countryModel.gdpPerCapitaInUSD(),
                countryModel.forestAreaPercentage(),
                countryModel.totalAreaInKm2(),
                countryModel.roadNetworkLengthInKm(),
                countryModel.averageAnnualTemperatureInC(),
                countryModel.annualPrecipitationInMm(),
                authenticatedUserId,
                newImageUrl
        );

        return countryService.updateCountry(updatedCountry);
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCountry(@PathVariable String id, @AuthenticationPrincipal OAuth2User authentication) {
        String authenticatedUserId = authentication.getName();
        CountryModel countryModel = countryService.getCountryById(id);

        if (!authenticatedUserId.equals(countryModel.githubId())) {
            throw new AccessDeniedException("You do not have permission to delete this country.");
        }
        countryService.deleteCountry(id);
    }



}

