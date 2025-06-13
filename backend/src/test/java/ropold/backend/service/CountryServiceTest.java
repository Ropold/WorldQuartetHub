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
    void testAddCountry(){

    }

    @Test
    void testUpdateCountry(){

    }

    @Test
    void testDeleteCountry(){

    }

    @Test
    void testGetCountriesForGithubUser(){

    }

    @Test
    void testGetCountriesByIds() {
        List<String> ids = List.of("1", "2");
        when(countryRepository.findAllById(ids)).thenReturn(countryModels);
        List<CountryModel> result = countryService.getCountriesByIds(ids);
        assertEquals(countryModels, result);
    }


}
