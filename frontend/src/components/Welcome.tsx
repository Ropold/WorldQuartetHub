import {useNavigate} from "react-router-dom";
import welcomePic from "../assets/world-quartet-original.jpg"
import "./styles/Welcome.css";

type WelcomeProps = {
    language: string;
}

function getLanguageForWelcome(code: string): string {
    switch (code) {
        case "en": return "Click on the Picture or the Play button to start playing!";
        case "de": return "Klicken Sie auf das Bild oder die Schaltfläche 'Spielen', um zu beginnen!";
        case "pl": return "Kliknij na obrazek lub przycisk 'Graj', aby rozpocząć zabawę!";
        case "es": return "¡Haz clic en la imagen o en el botón de jugar para comenzar a jugar!";
        case "fr": return "Cliquez sur l'image ou le bouton de jeu pour commencer à jouer !";
        case "it": return "Clicca sull'immagine o sul pulsante di gioco per iniziare a giocare!";
        case "ru": return "Нажмите на изображение или кнопку 'Играть', чтобы начать игру!";
        default: return code;
    }
}

export default function Welcome(props:Readonly<WelcomeProps>){
    const navigate = useNavigate();

    return (
        <>
            <h2>World Quartet Hub</h2>
            <p>{getLanguageForWelcome(props.language)}</p>
            <div className="image-wrapper margin-top-20">
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