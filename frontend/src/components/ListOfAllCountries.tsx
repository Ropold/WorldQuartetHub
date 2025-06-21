import type {CountryModel} from "./model/CountryModel.ts";
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import SearchBar from "./SearchBar.tsx";
import CountryCard from "./CountryCard.tsx";
import "./styles/CountryCard.css"

type ListOfAllCountriesProps = {
    user: string;
    favorites: string[];
    toggleFavorite: (questionId: string) => void;
    allCountries: CountryModel[];
    getAllCountries: () => void;
}

export default function ListOfAllCountries(props: Readonly<ListOfAllCountriesProps>) {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredCountries, setFilteredCountries] = useState<CountryModel[]>([]);

    const location = useLocation();

    useEffect(() => {
        window.scroll(0, 0);
    }, [location]);

    function filterCountries(countries: CountryModel[], query: string): CountryModel[] {
        return countries.filter(country =>
            country.countryName.toLowerCase().includes(query.toLowerCase()) ||
            country.capitalCity.toLowerCase().includes(query.toLowerCase())
        );
    }

    useEffect(() => {
        setFilteredCountries(filterCountries(props.allCountries, searchQuery));
    }, [props.allCountries, searchQuery]);

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
                />
                ))}
            </div>
        </>
    )
}