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

export default function App() {
    const [user, setUser] = useState<string>("anonymousUser");
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

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

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if(user !== "anonymousUser"){
            getUserDetails();
        }
    }, [user]);

  return (
    <>
        <Navbar getUser={getUser} getUserDetails={getUserDetails} user={user}/>
        <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Welcome/>}/>
            <Route element={<ProtectedRoute user={user}/>}>
                <Route path="/profile/*" element={<Profile user={user} userDetails={userDetails}  />} />
            </Route>
        </Routes>
        <Footer />
    </>
  )
}

