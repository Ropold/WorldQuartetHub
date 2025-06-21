import type {UserDetails} from "./model/UserDetailsModel.ts";
import {useEffect, useState} from "react";
import AddCountryCard from "./AddCountryCard.tsx";
import MyCountries from "./MyCountries.tsx";
import Favorites from "./Favorites.tsx";

type ProfileProps = {
    user: string;
    userDetails: UserDetails | null;
    favorites: string[];
    toggleFavorite: (questionId: string) => void;
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
                            onClick={() => setActiveTab("profile")}>Profil of Github
                    </button>
                    <button className={activeTab === "add-country" ? "active-profile-button" : "button-group-button"}
                            onClick={() => setActiveTab("add-country")}>Add new Country
                    </button>
                    <button className={activeTab === "my-countries" ? "active-profile-button" : "button-group-button"}
                            onClick={() => setActiveTab("my-countries")}>My Countries
                    </button>
                    <button className={activeTab === "favorites" ? "active-profile-button" : "button-group-button"}
                            onClick={() => setActiveTab("favorites")}>Favorites
                    </button>
                </div>
            </div>

            <div>
                {activeTab === "profile" && (
                    <>
                        <h2>GitHub Profile</h2>
                        {props.userDetails ? (
                            <div>
                                <p>Username: {props.userDetails.login}</p>
                                <p>Name: {props.userDetails.name || "No name provided"}</p>
                                <p>Location: {props.userDetails.location ?? "No location provided"}</p>
                                {props.userDetails.bio && <p>Bio: {props.userDetails.bio}</p>}
                                <p>Followers: {props.userDetails.followers}</p>
                                <p>Following: {props.userDetails.following}</p>
                                <p>Public Repositories: {props.userDetails.public_repos}</p>
                                <p>
                                    GitHub Profile:{" "}
                                    <a href={props.userDetails.html_url} target="_blank" rel="noopener noreferrer">
                                        Visit Profile
                                    </a>
                                </p>
                                <img className="profile-container-img" src={props.userDetails.avatar_url}
                                     alt={`${props.userDetails.login}'s avatar`}/>
                                <p>Account Created: {new Date(props.userDetails.created_at).toLocaleDateString()}</p>
                                <p>Last Updated: {new Date(props.userDetails.updated_at).toLocaleDateString()}</p>
                            </div>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </>
                )}

                {activeTab === "add-country" && <AddCountryCard/>}
                {activeTab === "my-countries" && <MyCountries/>}
                {activeTab === "favorites" && <Favorites user={props.user} favorites={props.favorites} toggleFavorite={props.toggleFavorite}/>}
            </div>
        </>
    );
}