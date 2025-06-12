package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.repository.CountryRepository;

@Service
@RequiredArgsConstructor
public class CountryService {

    private final IdService idService;
    private final CountryRepository countryRepository;
    private final CloudinaryService cloudinaryService;

}
