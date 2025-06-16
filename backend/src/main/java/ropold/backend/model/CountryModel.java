package ropold.backend.model;

public record CountryModel(
        String id,
        String countryName,
        String capitalCity,
        double populationInMillions,
        int populationDensityPerKm2,
        int capitalCityPopulation,
        int gdpPerCapitaInUSD,
        int forestAreaPercentage,
        int totalAreaInKm2,
        int roadNetworkLengthInKm,
        double averageAnnualTemperatureInC,
        int annualPrecipitationInMm,
        String githubId,
        String imageUrl
) {
}
