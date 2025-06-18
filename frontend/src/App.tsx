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

export default function App() {
    const [user, setUser] = useState<string>("anonymousUser");
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);

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
    }, []);

    useEffect(() => {
        if(user !== "anonymousUser"){
            getUserDetails();
            getAppUserFavorites();
        }
    }, [user]);

  return (
    <>
        <Navbar getUser={getUser} getUserDetails={getUserDetails} user={user}/>
        <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Welcome/>}/>
            <Route path="/list-of-all-countries" element={<ListOfAllCountries user={user} favorites={favorites} toggleFavorite={toggleFavorite}/>} />
            <Route path="/country/:id" element={<Details user={user} favorites={favorites} toggleFavorite={toggleFavorite}/>} />
            <Route element={<ProtectedRoute user={user}/>}>
                <Route path="/profile/*" element={<Profile user={user} userDetails={userDetails}  />} />
            </Route>
        </Routes>
        <Footer />
    </>
  )
}

