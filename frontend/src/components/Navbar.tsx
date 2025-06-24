import axios from "axios";
import {useNavigate} from "react-router-dom";
import "./styles/Navbar.css";
import "./styles/Buttons.css"
import headerLogo from "../assets/world-quartet-original.jpg"
import highScoreLogo from "../assets/highscore-logo.jpg"

type NavbarProps = {
    getUser: () => void;
    getUserDetails: () => void;
    user: string;
}

export default function Navbar(props: Readonly<NavbarProps>) {

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
                <h2 className="header-title">Play</h2>
                <img src={headerLogo} alt="World Quartet Hub Logo" className="logo-image" />
            </div>

            <div
                className="clickable-header"
                onClick={() => {
                    navigate("/list-of-all-countries");
                }}
            >
                <h2 className="header-title">All Countries</h2>
                <img src={headerLogo} alt="All Countries Logo" className="logo-image" />
            </div>

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