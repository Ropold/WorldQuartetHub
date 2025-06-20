package ropold.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ropold.backend.model.CountryModel;
import ropold.backend.repository.CountryRepository;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class CountryServiceTest {

    IdService idService = mock(IdService.class);
    CountryRepository countryRepository = mock(CountryRepository.class);
    CloudinaryService cloudinaryService = mock(CloudinaryService.class);
    CountryService countryService = new CountryService(idService, countryRepository, cloudinaryService);

    List<CountryModel> countryModels;

    @BeforeEach
    void setup(){
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

        countryModels = List.of(countryModel1, countryModel2);
        when(countryRepository.findAll()).thenReturn(countryModels);
    }

    @Test
    void testGetAllCountries() {
        List<CountryModel> result = countryService.getAllCountries();
        assertEquals(countryModels, result);
    }

    @Test
    void testGetCountryById() {
        CountryModel expectedCountry = countryModels.getFirst();
        when(countryRepository.findById(expectedCountry.id())).thenReturn(java.util.Optional.of(expectedCountry));
        CountryModel result = countryService.getCountryById(expectedCountry.id());
        assertEquals(expectedCountry, result);
    }

    @Test
    void testGetCountryByName() {
        String countryName = "Deutschland";
        CountryModel expectedCountry = countryModels.getFirst();
        when(countryRepository.findByCountryNameIgnoreCase(countryName)).thenReturn(java.util.Optional.of(expectedCountry));
        CountryModel result = countryService.getCountryByName(countryName);
        assertEquals(expectedCountry, result);
    }

    @Test
    void testAddCountry(){
        CountryModel countryModel3 = new CountryModel(
                null,
                "Italien",
                "Rom",
                60.4,
                200,
                2873000,
                35000,
                31,
                301340,
                1000000,
                15.5,
                900,
                "user",
                "http://example.com/country3.jpg"
        );

        when(idService.generateRandomId()).thenReturn("3");
        when(countryRepository.save(any(CountryModel.class))).thenReturn(countryModel3);

        CountryModel expected = countryService.addCountry(countryModel3);
        assertEquals(countryModel3,expected);
        verify(idService, times(1)).generateRandomId();
        verify(countryRepository).save(any(CountryModel.class));

    }

    @Test
    void testUpdateCountry(){
        CountryModel updatedCountry = new CountryModel(
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
                "http://example.com/updated_country1.jpg"
        );

        when(countryRepository.findById("1")).thenReturn(java.util.Optional.of(countryModels.getFirst()));
        when(idService.generateRandomId()).thenReturn("1");
        when(countryRepository.save(updatedCountry)).thenReturn(updatedCountry);

        CountryModel result = countryService.updateCountry(updatedCountry);
        assertEquals(updatedCountry, result);
        verify(countryRepository).save(updatedCountry);
    }

    @Test
    void testDeleteCountry(){
        CountryModel countryModel = countryModels.getFirst();
        when(countryRepository.findById(countryModel.id())).thenReturn(java.util.Optional.of(countryModel));
        countryService.deleteCountry("1");
        verify(countryRepository, times(1)).deleteById("1");
        verify(cloudinaryService, times(1)).deleteImage(countryModel.imageUrl());
    }

    @Test
    void testGetCountriesForGithubUser(){
        String githubId = "user";
        List<CountryModel> expectedCountries = countryModels.stream()
                .filter(country -> country.githubId().equals(githubId))
                .toList();
        when(countryRepository.findAll()).thenReturn(countryModels);
        List<CountryModel> result = countryService.getCountriesForGithubUser(githubId);
        assertEquals(expectedCountries, result);
        verify(countryRepository, times(1)).findAll();
    }

    @Test
    void testGetCountriesByIds() {
        List<String> ids = List.of("1", "2");
        when(countryRepository.findAllById(ids)).thenReturn(countryModels);
        List<CountryModel> result = countryService.getCountriesByIds(ids);
        assertEquals(countryModels, result);
    }

}
