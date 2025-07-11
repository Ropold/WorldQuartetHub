import type {UserDetails} from "./model/UserDetailsModel.ts";
import {useEffect, useState} from "react";
import AddCountryCard from "./AddCountryCard.tsx";
import MyCountries from "./MyCountries.tsx";
import Favorites from "./Favorites.tsx";
import type {CountryModel} from "./model/CountryModel.ts";
import {translatedGithubInfo} from "./utils/TranslatedGithubInfo.ts";
import {translatedGameInfo} from "./utils/TranslatedGameInfo.ts";

type ProfileProps = {
    user: string;
    userDetails: UserDetails | null;
    handleNewCountrySubmit: (newCountry: CountryModel) => void;
    handleUpdateCountry: (updatedCountry: CountryModel) => void;
    handleDeleteCountry: (countryId: string) => void;
    favorites: string[];
    toggleFavorite: (questionId: string) => void;
    language: string;
}

export default function Profile(props:Readonly<ProfileProps>) {

    const [isEditing, setIsEditing] = useState<boolean>(false);

    const [activeTab, setActiveTab] = useState<"profile" | "add-country" | "my-countries" | "favorites">(() => {
        const savedTab = localStorage.getItem("activeTab");
        return (savedTab as "profile" | "add-country" | "my-countries" | "favorites") || "profile";
    });

    useEffect(() => {
        localStorage.setItem("activeTab", activeTab);
    }, [activeTab]);


    return (
        <>
            <div className="profile-container">
                <div className="space-between" id="buttons-profile-container">
                    <button className={activeTab === "profile" ? "active-profile-button" : "button-group-button"}
                            onClick={() => setActiveTab("profile")}>{translatedGithubInfo["Profile GitHub"][props.language]}
                    </button>
                    <button className={activeTab === "favorites" ? "active-profile-button" : "button-group-button"}
                            onClick={() => setActiveTab("favorites")}>{translatedGameInfo["Favorites"][props.language]}
                    </button>
                    <button className={activeTab === "add-country" ? "active-profile-button" : "button-group-button"}
                            onClick={() => setActiveTab("add-country")}
                            disabled={props.user !== "154427648"}>{translatedGameInfo["Add new Country"][props.language]}
                    </button>
                    <button className={activeTab === "my-countries" ? "active-profile-button" : "button-group-button"}
                            onClick={() => {setActiveTab("my-countries"); setIsEditing(false)} }
                            disabled={props.user !== "154427648"}>{translatedGameInfo["My Countries"][props.language]}
                    </button>
                </div>
            </div>

            <div>
                {activeTab === "profile" && (
                    <>
                        <h2>{translatedGithubInfo["Profile GitHub"][props.language]}</h2>
                        {props.userDetails ? (
                            <div>
                                <p>{translatedGithubInfo["Username"][props.language]}: {props.userDetails.login}</p>
                                <p>{translatedGithubInfo["Name"][props.language]}: {props.userDetails.name || "No name provided"}</p>
                                <p>{translatedGithubInfo["Location"][props.language]}: {props.userDetails.location ?? "No location provided"}</p>
                                {props.userDetails.bio && <p>Bio: {props.userDetails.bio}</p>}
                                <p>{translatedGithubInfo["Followers"][props.language]}: {props.userDetails.followers}</p>
                                <p>{translatedGithubInfo["Following"][props.language]}: {props.userDetails.following}</p>
                                <p>{translatedGithubInfo["Public Repositories"][props.language]}: {props.userDetails.public_repos}</p>
                                <p>
                                    {translatedGithubInfo["Profile GitHub"][props.language]}:{" "}
                                    <a href={props.userDetails.html_url} target="_blank" rel="noopener noreferrer">
                                        {translatedGithubInfo["Visit Profile"][props.language]}
                                    </a>
                                </p>
                                <img className="profile-container-img" src={props.userDetails.avatar_url}
                                     alt={`${props.userDetails.login}'s avatar`}/>
                                <p>{translatedGithubInfo["Account Created"][props.language]}: {new Date(props.userDetails.created_at).toLocaleDateString()}</p>
                                <p>{translatedGithubInfo["Last Updated"][props.language]}: {new Date(props.userDetails.updated_at).toLocaleDateString()}</p>
                            </div>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </>
                )}

                {activeTab === "add-country" && <AddCountryCard user={props.user} handleNewCountrySubmit={props.handleNewCountrySubmit} language={props.language}/>}
                {activeTab === "my-countries" && <MyCountries user={props.user} favorites={props.favorites} toggleFavorite={props.toggleFavorite} isEditing={isEditing} setIsEditing={setIsEditing} handleUpdateCountry={props.handleUpdateCountry} handleDeleteCountry={props.handleDeleteCountry} language={props.language}/>}
                {activeTab === "favorites" && <Favorites user={props.user} favorites={props.favorites} toggleFavorite={props.toggleFavorite} language={props.language}/>}
            </div>
        </>
    );
}