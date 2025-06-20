package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.exception.CountryNotFoundException;
import ropold.backend.model.CountryModel;
import ropold.backend.repository.CountryRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CountryService {

    private final IdService idService;
    private final CountryRepository countryRepository;
    private final CloudinaryService cloudinaryService;

    public List<CountryModel> getAllCountries() {
        return countryRepository.findAll();
    }

    public CountryModel getCountryById(String id) {
        return countryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Country not found"));
    }

    public CountryModel getCountryByName(String countryName) {
        return countryRepository.findByCountryNameIgnoreCase(countryName)
                .orElseThrow(() -> new CountryNotFoundException("No Country found with name: " + countryName));
    }

    public CountryModel addCountry(CountryModel countryModel) {
        CountryModel newCountryModel = new CountryModel(
                idService.generateRandomId(),
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
                countryModel.imageUrl()
        );
        return countryRepository.save(newCountryModel);
    }

    public CountryModel updateCountry(CountryModel countryModel) {
        CountryModel existingCountry = getCountryById(countryModel.id());

        boolean oldHadImage = existingCountry.imageUrl() != null && !existingCountry.imageUrl().isBlank();
        boolean nowNoImage = countryModel.imageUrl() == null || countryModel.imageUrl().isBlank();
        boolean imageWasReplaced = oldHadImage && !existingCountry.imageUrl().equals(countryModel.imageUrl());

        if (oldHadImage && (nowNoImage || imageWasReplaced)) {
            cloudinaryService.deleteImage(existingCountry.imageUrl());
        }

        return countryRepository.save(countryModel);
    }

    public void deleteCountry(String id) {
        CountryModel countryModel = countryRepository.findById(id)
                .orElseThrow(() -> new CountryNotFoundException("No Country found with id: " + id));

        if(countryModel.imageUrl() != null) {
            cloudinaryService.deleteImage(countryModel.imageUrl());
        }
        countryRepository.deleteById(id);
    }

    public List<CountryModel> getCountriesByIds(List<String> favoriteCountriesIds) {
        return countryRepository.findAllById(favoriteCountriesIds);
    }

    public List<CountryModel> getCountriesForGithubUser(String githubId) {
        return countryRepository.findAll().stream()
                .filter(countryModel -> countryModel.githubId().equals(githubId))
                .toList();
    }
}
