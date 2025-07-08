import type {CountryModel} from "./model/CountryModel.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import CountryCard from "./CountryCard.tsx";
import "./styles/AddCountryCard.css";
import "./styles/Popup.css";
import {useLocation} from "react-router-dom";
import SearchBar from "./SearchBar.tsx";
import {translatedCapitalCities} from "./utils/TranslatedCapitalCities.ts";
import {translatedCountryNames} from "./utils/TranslatedCountryNames.ts";
import {translatedModelInfo} from "./utils/TranslatedModelInfo.ts";
import {translatedGameInfo} from "./utils/TranslatedGameInfo.ts";

type MyCountriesProps = {
    user: string;
    favorites: string[];
    toggleFavorite: (questionId: string) => void;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    handleUpdateCountry: (updatedCountry: CountryModel) => void;
    handleDeleteCountry: (countryId: string) => void;
    language: string;
}

export default function MyCountries(props: Readonly<MyCountriesProps>) {
    const [userCountries, setUserCountries] = useState<CountryModel[]>([]);
    const [editData, setEditData] = useState<CountryModel | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [countryToDelete, setCountryToDelete] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [imageChanged, setImageChanged] = useState(false);
    const [imageDeleted, setImageDeleted] = useState(false);

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredCountries, setFilteredCountries] = useState<CountryModel[]>([]);

    const location = useLocation();

    function filterCountries(countries: CountryModel[], query: string, language: string): CountryModel[] {
        const lowerQuery = query.toLowerCase();
        return countries.filter(country => {
            const name = translatedCountryNames[country.countryName]?.[language]?.toLowerCase() || "";
            const capital = translatedCapitalCities[country.capitalCity]?.[language]?.toLowerCase() || "";
            return name.includes(lowerQuery) || capital.includes(lowerQuery);
        });
    }

    useEffect(() => {
        setFilteredCountries(filterCountries(userCountries, searchQuery, props.language));
    }, [userCountries, searchQuery, props.language]);

    useEffect(() => {
        window.scroll(0, 0);
    }, [location]);

    function getUserCountries() {
        axios.get(`/api/users/me/my-countries/${props.user}`)
            .then((response) => {
                setUserCountries(response.data as CountryModel[]);
            })
            .catch((error) => {
                console.error("Error fetching countries:", error);
            });
    }
    useEffect(() => {
        getUserCountries();
    }, []);

    function handleEditToggle(countryId: string) {
        const countryToEdit = userCountries.find(country => country.id === countryId);
        if (countryToEdit) {
            setEditData(countryToEdit);
            props.setIsEditing(true);

            if (countryToEdit.imageUrl) {
                fetch(countryToEdit.imageUrl)
                    .then((response) => response.blob())
                    .then((blob) => {
                        const file = new File([blob], "current-image.jpg", { type: blob.type });
                        setImage(file);
                    })
                    .catch((error) => console.error("Error loading current image:", error));
            }
        }
    }

    function handleSaveEdit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!editData) return;

        let updatedImageUrl = editData.imageUrl;
        if (imageChanged) {
            if (image) {
                updatedImageUrl = "temp-image";
            } else if (imageDeleted) {
                updatedImageUrl = ""; // oder ggf. null, je nach Backend-API
            }
        }

        const updatedCountryData = {
            ...editData,
            imageUrl: updatedImageUrl,
        };

        const data = new FormData();
        if (imageChanged && image) {
            data.append("image", image);
        }
        data.append(
            "countryModel",
            new Blob([JSON.stringify(updatedCountryData)], { type: "application/json" })
        );

        axios
            .put(`/api/world-quartet-hub/${editData.id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((response) => {
                props.handleUpdateCountry(response.data);
                setUserCountries((prev) =>
                    prev.map((c) => (c.id === response.data.id ? response.data : c))
                );
                props.setIsEditing(false);
                setImageDeleted(false);
            })
            .catch((error) => {
                console.error("Error saving country edits:", error);
                alert("An unexpected error occurred. Please try again.");
            });
    }

    function onFileChange (e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setImage(e.target.files[0]);
            setImageChanged(true);
        }
    }

    function handleDeleteClick(id: string) {
        setCountryToDelete(id);
        setShowPopup(true);
    }

    function handleCancel(){
        setCountryToDelete(null);
        setShowPopup(false);
    }

    function handleConfirmDelete() {
        if (countryToDelete) {
            axios
                .delete(`/api/world-quartet-hub/${countryToDelete}`)
                .then(() => {
                    props.handleDeleteCountry(countryToDelete);
                    setUserCountries((prev) =>
                        prev.filter((c) => c.id !== countryToDelete)
                    );
                })
                .catch((error) => {
                    console.error("Error deleting question:", error);
                    alert("An unexpected error occurred. Please try again.");
                })
                .finally(() => {
                    setCountryToDelete(null);
                    setShowPopup(false);
                });
        }
    }

    return (
        <div>
            {props.isEditing ? (
                <div>
                    <h2>Edit Country</h2>
                    <form onSubmit={handleSaveEdit}>
                        <div className="edit-form">
                        <label>
                            {translatedModelInfo.countryName[props.language]}:
                            <input
                                className="input-small"
                                type="text"
                                value={editData?.countryName ?? ""}
                                onChange={(e) => setEditData({ ...editData!, countryName: e.target.value })}
                            />
                        </label>
                        <label>
                            {translatedModelInfo.capitalCity[props.language]}:
                            <input
                                className="input-small"
                                type="text"
                                value={editData?.capitalCity ?? ""}
                                onChange={(e) => setEditData({ ...editData!, capitalCity: e.target.value })}
                            />
                        </label>
                        <label>
                            {translatedModelInfo.populationInMillions[props.language]}:
                            <input
                                className="input-small"
                                type="number"
                                step="0.1"
                                value={editData?.populationInMillions ?? ""}
                                onChange={(e) => setEditData({ ...editData!, populationInMillions: parseFloat(e.target.value) })}
                            />
                        </label>
                        <label>
                            {translatedModelInfo.populationDensityPerKm2[props.language]}:
                            <input
                                className="input-small"
                                type="number"
                                value={editData?.populationDensityPerKm2 ?? ""}
                                onChange={(e) => setEditData({ ...editData!, populationDensityPerKm2: parseInt(e.target.value) })}
                            />
                        </label>
                        <label>
                            {translatedModelInfo.capitalCityPopulation[props.language]}:
                            <input
                                className="input-small"
                                type="number"
                                step="1000"
                                value={editData?.capitalCityPopulation ?? ""}
                                onChange={(e) => setEditData({ ...editData!, capitalCityPopulation: parseInt(e.target.value) })}
                            />
                        </label>
                        <label>
                            {translatedModelInfo.gdpPerCapitaInUSD[props.language]}:
                            <input
                                className="input-small"
                                type="number"
                                value={editData?.gdpPerCapitaInUSD ?? ""}
                                onChange={(e) => setEditData({ ...editData!, gdpPerCapitaInUSD: parseInt(e.target.value) })}
                            />
                        </label>
                        <label>
                            {translatedModelInfo.forestAreaPercentage[props.language]}:
                            <input
                                className="input-small"
                                type="number"
                                value={editData?.forestAreaPercentage ?? ""}
                                onChange={(e) => setEditData({ ...editData!, forestAreaPercentage: parseInt(e.target.value) })}
                            />
                        </label>
                        <label>
                            {translatedModelInfo.totalAreaInKm2[props.language]}:
                            <input
                                className="input-small"
                                type="number"
                                value={editData?.totalAreaInKm2 ?? ""}
                                onChange={(e) => setEditData({ ...editData!, totalAreaInKm2: parseInt(e.target.value) })}
                            />
                        </label>
                        <label>
                            {translatedModelInfo.roadNetworkLengthInKm[props.language]}:
                            <input
                                className="input-small"
                                type="number"
                                value={editData?.roadNetworkLengthInKm ?? ""}
                                onChange={(e) => setEditData({ ...editData!, roadNetworkLengthInKm: parseInt(e.target.value) })}
                            />
                        </label>
                        <label>
                            {translatedModelInfo.averageAnnualTemperatureInC[props.language]}:
                            <input
                                className="input-small"
                                type="number"
                                step="0.1"
                                value={editData?.averageAnnualTemperatureInC ?? ""}
                                onChange={(e) => setEditData({ ...editData!, averageAnnualTemperatureInC: parseFloat(e.target.value) })}
                            />
                        </label>
                        <label>
                            {translatedModelInfo.annualPrecipitationInMm[props.language]}:
                            <input
                                className="input-small"
                                type="number"
                                value={editData?.annualPrecipitationInMm ?? ""}
                                onChange={(e) => setEditData({ ...editData!, annualPrecipitationInMm: parseInt(e.target.value) })}
                            />
                        </label>
                    </div>

                    <div className="margin-top-20">
                        <label>
                            Image:
                            <input type="file" onChange={onFileChange} />
                            {image && (
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt={editData?.countryName ?? "Preview"}
                                    className="image-preview"
                                />
                            )}
                        </label>
                        <button className="button-group-button" type="button" onClick={() => { setImage(null); setImageChanged(true); setImageDeleted(true); }}>{translatedGameInfo["Remove Image"][props.language]}</button>
                    </div>


                    <div className="space-between">
                        <button className="button-group-button" type="submit">{translatedGameInfo["Save Changes"][props.language]}</button>
                        <button className="button-group-button" type="button" onClick={() => props.setIsEditing(false)}>{translatedGameInfo["Cancel"][props.language]}</button>
                    </div>
                    </form>
                </div>
            ) : (
                <>
                    <div>
                        <SearchBar
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />
                    </div>

                    <div className="country-card-container">
                        {userCountries.length > 0 ? (
                            filteredCountries.map((c) => (
                                <div key={c.id}>
                                    <CountryCard
                                        country={c}
                                        user={props.user}
                                        favorites={props.favorites}
                                        toggleFavorite={props.toggleFavorite}
                                        showButtons={true}
                                        handleEditToggle={handleEditToggle}
                                        handleDeleteClick={handleDeleteClick}
                                        language={props.language}
                                    />
                                </div>
                            ))
                        ) : (
                            <p>No Questions found for this user.</p>
                        )}
                    </div>
                </>
            )}

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this question?</p>
                        <div className="popup-actions">
                            <button onClick={handleConfirmDelete} className="popup-confirm">Yes, Delete</button>
                            <button onClick={handleCancel} className="popup-cancel">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}