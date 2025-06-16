package ropold.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ropold.backend.model.CountryModel;

public interface CountryRepository extends MongoRepository<CountryModel, String> {
}
