import {translatedGameInfo} from "./utils/TranslatedGameInfo.ts";

type QuartetModelProps = {
    language: string;
}

export default function QuartetModel(props: Readonly<QuartetModelProps>) {
    return (
        <p>{translatedGameInfo["Preview-Text"][props.language]}</p>
    )
}