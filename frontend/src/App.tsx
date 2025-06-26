import './App.css'
import {useEffect, useState} from "react";
import axios from "axios";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import {Route, Routes} from "react-router-dom";
import NotFound from "./components/NotFound.tsx";
import Welcome from "./components/Welcome.tsx";
import Profile from "./components/Profile.tsx";
import type {UserDetails} from "./components/model/UserDetailsModel.ts";
import Footer from "./components/Footer.tsx";
import Navbar from "./components/Navbar.tsx";
import type {CountryModel} from "./components/model/CountryModel.ts";
import ListOfAllCountries from "./components/ListOfAllCountries.tsx";
import Details from "./components/Details.tsx";
import Play from "./components/Play.tsx";
import HighScore from "./components/HighScore.tsx";
import type {HighScoreModel} from "./components/model/HighScoreModel.ts";

export default function App() {
    const [user, setUser] = useState<string>("anonymousUser");
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [allCountries, setAllCountries] = useState<CountryModel[]>([]);

    const [language, setLanguage] = useState<string>("en");

    const [highScores, setHighScores] = useState<{[key: number]: HighScoreModel[]}>({ 5: [], 10: [], 25: [] });

    function getUser() {
        axios.get("/api/users/me")
            .then((response) => {
                setUser(response.data.toString());
            })
            .catch((error) => {
                console.error(error);
                setUser("anonymousUser");
            });
    }

    function getUserDetails() {
        axios.get("/api/users/me/details")
            .then((response) => {
                setUserDetails(response.data as UserDetails);
            })
            .catch((error) => {
                console.error(error);
                setUserDetails(null);
            });
    }

    function getAllCountries() {
        axios.get("/api/world-quartet-hub")
            .then((response) => {
                setAllCountries(response.data as CountryModel[]);
            })
            .catch((error) => {
                console.error("Error fetching countries:", error);
            });
    }

    function getAppUserFavorites(){
        axios.get<CountryModel[]>(`/api/users/favorites`)
            .then((response) => {
                const favoriteIds = response.data.map((country) => country.id);
                setFavorites(favoriteIds);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function toggleFavorite(countryId: string) {
        const isFavorite = favorites.includes(countryId);

        if (isFavorite) {
            axios.delete(`/api/users/favorites/${countryId}`)
                .then(() => {
                    setFavorites((prevFavorites) =>
                        prevFavorites.filter((id) => id !== countryId)
                    );
                })
                .catch((error) => console.error(error));
        } else {
            axios.post(`/api/users/favorites/${countryId}`)
                .then(() => {
                    setFavorites((prevFavorites) => [...prevFavorites, countryId]);
                })
                .catch((error) => console.error(error));
        }
    }

    useEffect(() => {
        getUser();
        getAllCountries();
    }, []);

    useEffect(() => {
        if(user !== "anonymousUser"){
            getUserDetails();
            getAppUserFavorites();
        }
    }, [user]);

    function handleNewCountrySubmit(newCountry: CountryModel) {
        setAllCountries((prevCountries) => [...prevCountries, newCountry]);
    }

    function handleUpdateCountry(updatedCountry: CountryModel) {
        setAllCountries((prev) =>
            prev.map((country) =>
                country.id === updatedCountry.id ? updatedCountry : country
            )
        );
    }

    function handleDeleteCountry(deletedId: string) {
        setAllCountries((prev) =>
            prev.filter((country) => country.id !== deletedId)
        );
    }

    function getHighScore(count: number) {
        axios.get(`/api/high-score/${count}`)
            .then((response) => {
                setHighScores((prev) => ({
                    ...prev,
                    [count]: response.data,
                }));
            })
            .catch((error) => {
                console.error(`Error fetching high score ${count}:`, error);
            });
    }

    useEffect(() => {
        [5, 10, 25].forEach(getHighScore);
    }, []);



    return (
    <>
        <Navbar user={user} getUser={getUser} getUserDetails={getUserDetails} language={language} setLanguage={setLanguage}/>
        <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Welcome language={language}/>}/>
            <Route path="/play" element={<Play/>} />
            <Route path="/list-of-all-countries" element={<ListOfAllCountries user={user} favorites={favorites} toggleFavorite={toggleFavorite} allCountries={allCountries} getAllCountries={getAllCountries} language={language}/>} />
            <Route path="/country/:countryName" element={<Details user={user} favorites={favorites} toggleFavorite={toggleFavorite} language={language}/>} />
            <Route path="/high-score" element={<HighScore/>} />
            <Route element={<ProtectedRoute user={user}/>}>
                <Route path="/profile/*" element={<Profile user={user} userDetails={userDetails} handleNewCountrySubmit={handleNewCountrySubmit} handleUpdateCountry={handleUpdateCountry} handleDeleteCountry={handleDeleteCountry} favorites={favorites} toggleFavorite={toggleFavorite} language={language}/>} />
            </Route>
        </Routes>
        <Footer />
    </>
  )
}

