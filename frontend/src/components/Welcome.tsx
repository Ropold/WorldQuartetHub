import {useNavigate} from "react-router-dom";
import welcomePic from "../assets/world-quartet-original.jpg"
import "./styles/Welcome.css";

export default function Welcome(){
    const navigate = useNavigate();

    return (
        <>
            <h2>World Quartet Hub</h2>
            <p>Click on the Picture or the Play button to start playing!</p>
            <div className="image-wrapper">
                <img
                    src={welcomePic}
                    alt="Welcome to Word Link Hub"
                    className="logo-welcome"
                    onClick={()=> navigate("/play")}
                />
            </div>
        </>
    )
}