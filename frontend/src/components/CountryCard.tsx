import type {CountryModel} from "./model/CountryModel.ts";
import "./styles/CountryCard.css";
import {useNavigate} from "react-router-dom";
import {countryNameToIsoCode, flagImages} from "./utils/FlagImages.ts";

type CountryCardProps = {
    country: CountryModel;
    user: string;
    favorites: string[];
    toggleFavorite: (animalId: string) => void;
    showButtons?: boolean;
    handleEditToggle?: (id: string) => void;
    handleDeleteClick?: (id: string) => void;
}

export default function CountryCard(props: Readonly<CountryCardProps>){
    const navigate = useNavigate();
    const isoCode = countryNameToIsoCode[props.country.countryName];
    const flagSrc = isoCode ? flagImages[isoCode] : null;

    const handleCardClick = () => {
        navigate(`/country/${props.country.id}`);
    }

    const isFavorite = props.favorites.includes(props.country.id);

    return (
        <div className="question-card" onClick={handleCardClick}>
            <h3>{props.country.countryName}</h3>
            <img
                src={flagSrc ?? props.country.imageUrl ?? undefined}
                alt={`${props.country.countryName} flag`}
                className="country-card-image"
            />

            {props.user !== "anonymousUser" && (
                <button
                    id="button-favorite-country-card"
                    onClick={(event) => {
                        event.stopPropagation(); // Verhindert die Weitergabe des Klicks an die Karte
                        props.toggleFavorite(props.country.id);
                    }}
                    className={isFavorite ? "favorite-on" : "favorite-off"}
                >
                    ♥
                </button>
            )}

            {props.showButtons && (
                <div className="space-between">
                    <button
                        className="button-group-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            props.handleEditToggle?.(props.country.id);
                        }}
                    >
                        Edit
                    </button>
                    <button
                        id="button-delete"
                        onClick={(e) => {
                            e.stopPropagation();
                            props.handleDeleteClick?.(props.country.id);
                        }}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    )
}