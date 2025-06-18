import {useEffect, useState} from "react";
import axios from "axios";
import {type CountryModel, DefaultCountry} from "./model/CountryModel.ts";
import {DefaultUserDetails, type UserDetails} from "./model/UserDetailsModel.ts";
import {useParams} from "react-router-dom";

type DetailsProps = {
    user: string;
    favorites: string[];
    toggleFavorite: (countryId: string) => void;
}

export default function Details(props: Readonly<DetailsProps>) {

    const [country, setCountry] = useState<CountryModel>(DefaultCountry);
    const [githubUser, setGithubUser] = useState<UserDetails>(DefaultUserDetails);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (!id) return;
        axios
            .get(`/api/world-quartet-hub/${id}`)
            .then((response) => setCountry(response.data))
            .catch((error) => console.error("Error fetching Country details", error));
    }, [id]);

    const fetchGithubUsername = async () => {
        try {
            const response = await axios.get(`https://api.github.com/user/${country.githubId}`);
            setGithubUser(response.data);
        } catch (error) {
            console.error("Error fetching Github-User", error);
        }
    };

    useEffect(() => {
        if (country.githubId) {
            fetchGithubUsername();
        }
    }, [country.githubId]);

    const isFavorite = props.favorites.includes(country.id);


    return (
        <>
        <p>Details</p>
        <p>{country.countryName}</p>
        </>
    )
}