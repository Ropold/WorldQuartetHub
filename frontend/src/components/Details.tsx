import {useEffect, useState} from "react";
import axios from "axios";
import {type CountryModel, DefaultCountry} from "./model/CountryModel.ts";
import {DefaultUserDetails, type UserDetails} from "./model/UserDetailsModel.ts";
import {useParams} from "react-router-dom";
import {countryNameToIsoCode, flagImages} from "./utils/FlagImages.ts";
import "./styles/Details.css";
import "./styles/Profile.css"

type DetailsProps = {
    user: string;
    favorites: string[];
    toggleFavorite: (countryId: string) => void;
}

export default function Details(props: Readonly<DetailsProps>) {

    const [country, setCountry] = useState<CountryModel>(DefaultCountry);
    const [githubUser, setGithubUser] = useState<UserDetails>(DefaultUserDetails);
    const { countryName } = useParams<{ countryName: string }>();
    const isoCode = countryNameToIsoCode[country.countryName];
    const flagSrc = isoCode ? flagImages[isoCode] : null;
    const isFavorite = props.favorites.includes(country.id);

    useEffect(() => {
        if (!countryName) return;
        axios
            .get(`/api/world-quartet-hub/country/${countryName}`)
            .then((response) => setCountry(response.data))
            .catch((error) => console.error("Error fetching Country details", error));
    }, [countryName]);

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


    return (
        <>
            <div className="details-container">
                <h2>{country.countryName}</h2>
                <p><strong>capitalCity:</strong> {country.capitalCity}</p>
                <p><strong>populationInMillions:</strong> {country.populationInMillions}</p>
                <p><strong>populationDensityPerKm2:</strong> {country.populationDensityPerKm2}</p>
                <p><strong>capitalCityPopulation:</strong> {country.capitalCityPopulation}</p>
                <p><strong>gdpPerCapitaInUSD:</strong> {country.gdpPerCapitaInUSD}</p>
                <p><strong>forestAreaPercentage:</strong> {country.forestAreaPercentage}</p>
                <p><strong>totalAreaInKm2:</strong> {country.totalAreaInKm2}</p>
                <p><strong>roadNetworkLengthInKm:</strong> {country.roadNetworkLengthInKm}</p>
                <p><strong>averageAnnualTemperatureInC:</strong> {country.averageAnnualTemperatureInC}</p>
                <p><strong>annualPrecipitationInMm:</strong> {country.annualPrecipitationInMm}</p>

                {country.imageUrl && (
                    <img
                        className="details-image"
                        src={country.imageUrl}
                        alt={`${country.countryName} image`}
                    />
                )}

                {flagSrc && (
                    <img
                        className="details-image"
                        src={flagSrc}
                        alt={`${country.countryName} flag`}
                    />
                )}

                {props.user !== "anonymousUser" && (
                    <div>
                        <button
                            className={`button-group-button margin-top-20 ${isFavorite ? "favorite-on" : "favorite-off"}`}
                            onClick={() => props.toggleFavorite(country.id)}
                        >
                            ♥
                        </button>
                    </div>
                )}
            </div>
            <div>
                <h3>Added by User</h3>
                <p><strong>Github-User</strong> {githubUser.login} </p>
                <p><strong>GitHub Profile</strong> <a href={githubUser.html_url} target="_blank" rel="noopener noreferrer">Visit Profile</a></p>
                <img className="profile-container-img" src={githubUser.avatar_url} alt={`${githubUser.login}'s avatar`} />
            </div>
            </>
    )
}