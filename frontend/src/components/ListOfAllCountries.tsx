import axios from "axios";
import type {CountryModel} from "./model/CountryModel.ts";
import {useEffect, useState} from "react";

type ListOfAllCountriesProps = {
    favorites: string[];
    toggleFavorite: (questionId: string) => void;
}

export default function ListOfAllCountries(props: Readonly<ListOfAllCountriesProps>) {
    const[allCountries, setAllCountries] = useState<CountryModel[]>([]);

    function getAllCountries() {
        axios.get("/api/world-quartet-hub")
            .then((response) => {
                setAllCountries(response.data as CountryModel[]);
            })
            .catch((error) => {
                console.error("Error fetching countries:", error);
            });
    }

    useEffect(() => {
        getAllCountries();
    }, []);

    return(
        <>
        </>
    )
}