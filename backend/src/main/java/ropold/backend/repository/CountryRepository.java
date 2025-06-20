package ropold.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ropold.backend.model.CountryModel;

import java.util.Optional;

public interface CountryRepository extends MongoRepository<CountryModel, String> {

    Optional<CountryModel> findByCountryNameIgnoreCase(String countryName);
}
