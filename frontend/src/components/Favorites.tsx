import {useEffect, useState} from "react";
import type {CountryModel} from "./model/CountryModel.ts";
import axios from "axios";
import CountryCard from "./CountryCard.tsx";

type FavoritesProps = {
    user: string;
    favorites: string[];
    toggleFavorite: (questionId: string) => void;
}

export default function Favorites(props: Readonly<FavoritesProps>) {
    const [favoritesCountries, setFavoritesCountries] = useState<CountryModel[]>([]);

    useEffect(() => {
        axios
            .get(`/api/users/favorites`)
            .then((response) => {
                setFavoritesCountries(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [props.user, props.favorites]);

    return (
        <div className="country-card-container">
            {favoritesCountries.length > 0 ? (
                favoritesCountries.map((c: CountryModel) => (
                    <CountryCard
                        key={c.id}
                        country={c}
                        user={props.user}
                        favorites={props.favorites}
                        toggleFavorite={props.toggleFavorite}
                    />
                ))
            ) : (
                <p>No Countries in favorites</p>
            )}
        </div>
    )
}