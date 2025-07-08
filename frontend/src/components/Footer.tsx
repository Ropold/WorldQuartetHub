import {translatedGameInfo} from "./utils/TranslatedGameInfo.ts";

type FooterProps = {
    language: string;
}

export default function Footer(props: Readonly<FooterProps>) {
    return (
        <footer className="footer">
            <p>{translatedGameInfo["World Quartet Hub 2025 by R.Stolz - Country data from 2022"][props.language]}</p>
        </footer>
    )
}