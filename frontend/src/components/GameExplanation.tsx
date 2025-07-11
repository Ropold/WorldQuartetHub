import {DefaultCountryFrance, DefaultCountryPoland} from "./model/CountryModel.ts";
import {translatedModelInfo} from "./utils/TranslatedModelInfo.ts";
import {translatedCapitalCities} from "./utils/TranslatedCapitalCities.ts";
import {translatedGameInfo} from "./utils/TranslatedGameInfo.ts";

type QuartetModelProps = {
    language: string;
}

export default function GameExplanation(props: Readonly<QuartetModelProps>) {
    const userCountry = DefaultCountryFrance;
    const cpuCountry = DefaultCountryPoland;

    return (<>
            <p>{translatedGameInfo["Rules"][props.language]}</p>
            <div className="game-cards-container-preview">
                <div className={("preview-teal loser-border pastel-teal")}>
                     <h2 className="text-country-property">
                        <p className="property-label">{translatedModelInfo.capitalCity[props.language]}:</p>
                        <p className="value-line-tile"><strong>{translatedCapitalCities[userCountry.capitalCity][props.language]}</strong></p>
                     </h2>
                </div>

                <div className={("preview-teal winner-border pastel-teal")}>
                    <h2 className="text-country-property">
                        <p className="property-label">{translatedModelInfo.capitalCity[props.language]}:</p>
                        <p className="value-line-tile"><strong>{translatedCapitalCities[cpuCountry.capitalCity][props.language]}</strong></p>
                    </h2>
                </div>
                <div className="preview-teal explanation-border small-font">
                    <p>{translatedGameInfo["City-Wins-1"][props.language]}</p>
                    <p>{translatedGameInfo["City-Wins-2"][props.language]}</p>
                </div>

            </div>

            <div className="game-cards-container-preview">
                <div className={("preview-teal winner-border pastel-yellow")} >
                    <h2 className="text-country-property">
                        <p className="property-label">{translatedModelInfo.capitalCityPopulation[props.language]}:</p>
                        <p className="value-line-tile"><strong>{userCountry.capitalCityPopulation.toLocaleString("de-DE")}</strong></p>
                    </h2>
                </div>

                <div className={("preview-teal loser-border pastel-yellow")} >
                    <h2 className="text-country-property">
                        <p className="property-label">{translatedModelInfo.capitalCityPopulation[props.language]}:</p>
                        <p className="value-line-tile"><strong>{cpuCountry.capitalCityPopulation.toLocaleString("de-DE")}</strong></p>
                    </h2>
                </div>
                <div className="preview-teal explanation-border small-font">
                    <p>{translatedGameInfo["Population-Wins-1"][props.language]}</p>
                    <p>{translatedGameInfo["Population-Wins-2"][props.language]}</p>
                </div>
            </div>

            <div className="game-cards-container-preview">
                <div className={("preview-teal tie-border pastel-green")} >
                    <h2 className="text-country-property">
                        <p className="property-label">{translatedModelInfo.forestAreaPercentage[props.language]}:</p>
                        <p className="value-line-tile"><strong>{userCountry.forestAreaPercentage} %</strong></p>
                    </h2>
                </div>

                <div className={("preview-teal tie-border pastel-green")} >
                    <h2 className="text-country-property">
                        <p className="property-label">{translatedModelInfo.forestAreaPercentage[props.language]}:</p>
                        <p className="value-line-tile"><strong>{cpuCountry.forestAreaPercentage} %</strong></p>
                    </h2>
                </div>
                <div className="preview-teal explanation-border more-small-font">
                    <p>{translatedGameInfo["Forest-Tie-1"][props.language]}</p>
                    <p>{translatedGameInfo["Forest-Tie-2"][props.language]}</p>
                </div>
            </div>
        </>

    )
}