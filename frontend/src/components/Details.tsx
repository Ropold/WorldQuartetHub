import {useEffect, useState} from "react";
import axios from "axios";
import {type CountryModel, DefaultCountryFrance} from "./model/CountryModel.ts";
import {DefaultUserDetails, type UserDetails} from "./model/UserDetailsModel.ts";
import {useParams} from "react-router-dom";
import {countryNameToIsoCode, flagImages} from "./utils/FlagImages.ts";
import "./styles/Details.css";
import "./styles/Profile.css"
import {translatedCountryNames} from "./utils/TranslatedCountryNames.ts";
import {translatedModelInfo} from "./utils/TranslatedModelInfo.ts";
import {translatedCapitalCities} from "./utils/TranslatedCapitalCities.ts";

type DetailsProps = {
    user: string;
    favorites: string[];
    toggleFavorite: (countryId: string) => void;
    language: string;
}

export default function Details(props: Readonly<DetailsProps>) {

    const [country, setCountry] = useState<CountryModel>(DefaultCountryFrance);
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
                <h2>{translatedCountryNames[country.countryName]?.[props.language] ?? country.countryName}</h2>
                <p> <strong>{translatedModelInfo.capitalCity[props.language]}: </strong>
                    {translatedCapitalCities[country.capitalCity]?.[props.language] || country.capitalCity}
                </p>
                <p><strong>{translatedModelInfo.populationInMillions[props.language]}</strong>: {country.populationInMillions} {translatedModelInfo["mio"][props.language]}</p>
                <p><strong>{translatedModelInfo.populationDensityPerKm2[props.language]}</strong>: {country.populationDensityPerKm2} {translatedModelInfo["Density Units"][props.language]}</p>
                <p><strong>{translatedModelInfo.capitalCityPopulation[props.language]}</strong>: {country.capitalCityPopulation.toLocaleString("de-DE")}</p>
                <p><strong>{translatedModelInfo.gdpPerCapitaInUSD[props.language]}</strong>: {country.gdpPerCapitaInUSD.toLocaleString("de-DE")} $</p>
                <p><strong>{translatedModelInfo.forestAreaPercentage[props.language]}</strong>: {country.forestAreaPercentage} %</p>
                <p><strong>{translatedModelInfo.totalAreaInKm2[props.language]}</strong>: {country.totalAreaInKm2.toLocaleString("de-DE")} km²</p>
                <p><strong>{translatedModelInfo.roadNetworkLengthInKm[props.language]}</strong>: {country.roadNetworkLengthInKm.toLocaleString("de-DE")} km</p>
                <p><strong>{translatedModelInfo.averageAnnualTemperatureInC[props.language]}</strong>: {country.averageAnnualTemperatureInC} °C</p>
                <p><strong>{translatedModelInfo.annualPrecipitationInMm[props.language]}</strong>: {country.annualPrecipitationInMm.toLocaleString("de-DE")} mm</p>

                {country.imageUrl && (
                    <img
                        className="details-image"
                        src={country.imageUrl}
                        alt={country.countryName}
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
                {githubUser.avatar_url && (
                    <img
                        className="profile-container-img"
                        src={githubUser.avatar_url}
                        alt={`${githubUser.login}'s avatar`}
                    />
                )}
            </div>
            </>
    )
}