import './App.css'
import {useEffect, useState} from "react";
import axios from "axios";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import {Route, Routes} from "react-router-dom";
import NotFound from "./components/NotFound.tsx";
import Welcome from "./components/Welcome.tsx";
import Profile from "./components/Profile.tsx";

export default function App() {
    const [user, setUser] = useState<string>("anonymousUser");

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

    useEffect(() => {
        getUser();
    }, []);

  return (
    <>
        <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Welcome/>}/>
            <Route element={<ProtectedRoute user={user}/>}>
                <Route path="/profile/*" element={<Profile />} />
            </Route>
        </Routes>
    </>
  )
}

