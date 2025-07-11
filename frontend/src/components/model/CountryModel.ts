
export type CountryModel = {
    id: string;
    countryName: string;
    capitalCity: string;
    populationInMillions: number;
    populationDensityPerKm2: number;
    capitalCityPopulation: number;
    gdpPerCapitaInUSD: number;
    forestAreaPercentage: number;
    totalAreaInKm2: number;
    roadNetworkLengthInKm: number;
    averageAnnualTemperatureInC: number;
    annualPrecipitationInMm: number;
    githubId: string;
    imageUrl: string | null;
};


export const DefaultCountryFrance: CountryModel = {
    id: 'FR',
    countryName: 'France',
    capitalCity: 'Paris',
    populationInMillions: 67.4,
    populationDensityPerKm2: 106,
    capitalCityPopulation: 2175601,
    gdpPerCapitaInUSD: 46062,
    forestAreaPercentage: 31,
    totalAreaInKm2: 632734,
    roadNetworkLengthInKm: 1053215,
    averageAnnualTemperatureInC: 11.7,
    annualPrecipitationInMm: 720,
    githubId: '154427648',
    imageUrl: null
};

export const DefaultCountryPoland: CountryModel = {
    id: 'PL',
    countryName: 'Poland',
    capitalCity: 'Warsaw',
    populationInMillions: 37.8,
    populationDensityPerKm2: 123,
    capitalCityPopulation: 1794166,
    gdpPerCapitaInUSD: 34103,
    forestAreaPercentage: 31,
    totalAreaInKm2: 312696,
    roadNetworkLengthInKm: 420000,
    averageAnnualTemperatureInC: 9.3,
    annualPrecipitationInMm: 695,
    githubId: '154427648',
    imageUrl: null
};



