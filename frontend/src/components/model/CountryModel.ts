
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
    imageUrl: string;
};


export const DefaultCountry: CountryModel = {
    id: 'FR',
    countryName: 'Frankreich',
    capitalCity: 'Paris',
    populationInMillions: 67.75,
    populationDensityPerKm2: 122,
    capitalCityPopulation: 2161000,
    gdpPerCapitaInUSD: 43500,
    forestAreaPercentage: 31,
    totalAreaInKm2: 551695,
    roadNetworkLengthInKm: 1040000,
    averageAnnualTemperatureInC: 11.7,
    annualPrecipitationInMm: 850,
    githubId: '154427648',
    imageUrl: 'https://example.com/france.jpg'
};


