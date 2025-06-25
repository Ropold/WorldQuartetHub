import axios from "axios";
import {useNavigate} from "react-router-dom";
import "./styles/Navbar.css";
import "./styles/Buttons.css"
import headerLogo from "../assets/world-quartet-original.jpg"
import highScoreLogo from "../assets/highscore-logo.jpg"
import * as React from "react";
import {LanguagesImages} from "./utils/FlagImages.ts";

type NavbarProps = {
    user: string;
    getUser: () => void;
    getUserDetails: () => void;
    language: string;
    setLanguage: React.Dispatch<React.SetStateAction<string>>
}

export default function Navbar(props: Readonly<NavbarProps>) {
    const [showLanguagePopup, setShowLanguagePopup] = React.useState(false);

    const navigate = useNavigate();

    function loginWithGithub() {
        const host = window.location.host === "localhost:5173" ? "http://localhost:8080" : window.location.origin;
        window.open(host + "/oauth2/authorization/github", "_self");
    }

    function logoutFromGithub() {
        axios
            .post("/api/users/logout")
            .then(() => {
                props.getUser();
                props.getUserDetails();
                navigate("/");
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    }

    function getLanguageName(code: string): string {
        switch (code) {
            case "en": return "English";
            case "de": return "Deutsch";
            case "pl": return "Polski";
            case "es": return "Español";
            case "fr": return "Français";
            case "it": return "Italiano";
            case "ru": return "Русский";
            default: return code;
        }
    }

    function getLanguageForAllCountries(code: string): string {
        switch (code) {
            case "en": return "All Countries";
            case "de": return "Alle Länder";
            case "pl": return "Wszystkie Kraje";
            case "es": return "Todos los Países";
            case "fr": return "Tous les Pays";
            case "it": return "Tutti i Paesi";
            case "ru": return "Все Страны";
            default: return code;
        }
    }

    function getLanguageForPlay(code: string): string {
        switch (code) {
            case "en": return "Play";
            case "de": return "Spielen";
            case "pl": return "Graj";
            case "es": return "Jugar";
            case "fr": return "Jouer";
            case "it": return "Gioca";
            case "ru": return "Играть";
            default: return code;
        }
    }

    return (
        <nav className="navbar">
            <button className="button-group-button" onClick={() => navigate("/")}>Home</button>
            <div
                className="clickable-header"
                id="clickable-header-play"
                onClick={() => {
                    navigate("/play");
                }}
            >
                <h2 className="header-title">{getLanguageForPlay(props.language)}</h2>
                <img src={headerLogo} alt="World Quartet Hub Logo" className="logo-image" />
            </div>

            <div
                className="clickable-header"
                onClick={() => {
                    navigate("/list-of-all-countries");
                }}
            >
                <h2 className="header-title">{getLanguageForAllCountries(props.language)}</h2>
                <img src={headerLogo} alt="All Countries Logo" className="logo-image" />
            </div>

            <div
                className="clickable-header"
                onClick={() => setShowLanguagePopup(true)}
            >
                <h2 className="header-title">{getLanguageName(props.language)}</h2>
                <img src={LanguagesImages[props.language]} alt="Language Logo" className="logo-image" />
            </div>

            {showLanguagePopup && (
                <div
                    className="popup-overlay"
                    onClick={() => setShowLanguagePopup(false)}
                >
                    <div
                        className="popup-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>Select Language</h2>
                        <div className="popup-language-options">
                            {["en", "de", "pl", "es", "fr", "it", "ru"].map((lang) => (
                                <button
                                    key={lang}
                                    className="language-option-button"
                                    onClick={() => {
                                        props.setLanguage(lang);
                                        setShowLanguagePopup(false);
                                    }}
                                >
                                    <img
                                        src={LanguagesImages[lang]}
                                        alt={lang}
                                        className="language-flag"
                                    />
                                    {getLanguageName(lang)}
                                </button>
                            ))}
                        </div>
                        <button
                            className="popup-cancel margin-top-20"
                            onClick={() => setShowLanguagePopup(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}



            <div
                className="clickable-header"
                id="button-high-score"
                onClick={() => {
                    navigate("/high-score");
                }}
            >
                <h2 className="header-title">High Score</h2>
                <img src={highScoreLogo} alt="High Score Logo" className="logo-image" />
            </div>


            {props.user !== "anonymousUser" ? (
                <>
                    <button id="button-profile" onClick={() => navigate("/profile")}>Profile</button>
                    <button className="button-group-button" onClick={logoutFromGithub}>Logout</button>
                </>
            ) : (
                <button className="button-group-button" onClick={loginWithGithub}>Login with GitHub</button>
            )}
        </nav>
    );
}