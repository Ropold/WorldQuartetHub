import type {CountryModel} from "./model/CountryModel.ts";
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import SearchBar from "./SearchBar.tsx";
import CountryCard from "./CountryCard.tsx";
import "./styles/CountryCard.css"
import {translatedCapitalCities} from "./utils/TranslatedCapitalCities.ts";
import {translatedCountryNames} from "./utils/TranslatedCountryNames.ts";

type ListOfAllCountriesProps = {
    user: string;
    favorites: string[];
    toggleFavorite: (questionId: string) => void;
    allCountries: CountryModel[];
    getAllCountries: () => void;
    language: string;
}

export default function ListOfAllCountries(props: Readonly<ListOfAllCountriesProps>) {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredCountries, setFilteredCountries] = useState<CountryModel[]>([]);

    const location = useLocation();

    useEffect(() => {
        window.scroll(0, 0);
    }, [location]);

    function filterCountries(countries: CountryModel[], query: string, language: string): CountryModel[] {
        return countries.filter(country => {
            const name = translatedCountryNames[country.countryName]?.[language]?.toLowerCase() || "";
            const capital = translatedCapitalCities[country.capitalCity]?.[language]?.toLowerCase() || "";
            return name.includes(query.toLowerCase()) || capital.includes(query.toLowerCase());
        });
    }

    useEffect(() => {
        setFilteredCountries(filterCountries(props.allCountries, searchQuery, props.language));
    }, [props.allCountries, searchQuery, props.language]);


    return(
        <>
            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <div className="country-card-container">
                {filteredCountries.map((c:CountryModel) => (

                <CountryCard
                    key={c.id}
                    country={c}
                    user={props.user}
                    favorites={props.favorites}
                    toggleFavorite={props.toggleFavorite}
                    language={props.language}
                />
                ))}
            </div>
        </>
    )
}