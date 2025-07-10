import {translatedGameInfo} from "./utils/TranslatedGameInfo.ts";
import {DefaultCountryFrance, DefaultCountryPoland} from "./model/CountryModel.ts";
import {translatedModelInfo} from "./utils/TranslatedModelInfo.ts";
import {translatedCapitalCities} from "./utils/TranslatedCapitalCities.ts";

type QuartetModelProps = {
    language: string;
}

export default function GameExplanation(props: Readonly<QuartetModelProps>) {
    const userCountry = DefaultCountryFrance;
    const cpuCountry = DefaultCountryPoland;

    return (<>
        <p>{translatedGameInfo["Preview-Text"][props.language]}</p>
            <div className="game-cards-container-preview">

                <div className={("loser-border pastel-teal")}>
                     <h2 className="text-country-property">
                        <p className="property-label">{translatedModelInfo.capitalCity[props.language]}:</p>
                        <p className="value-line-tile"><strong>{translatedCapitalCities[userCountry.capitalCity][props.language]}</strong></p>
                     </h2>
                </div>

                <div className={("winner-border pastel-teal")}>
                    <h2 className="text-country-property">
                        <p className="property-label">{translatedModelInfo.capitalCity[props.language]}:</p>
                        <p className="value-line-tile"><strong>{translatedCapitalCities[cpuCountry.capitalCity][props.language]}</strong></p>
                    </h2>
                </div>
            </div>
            <p>User</p>

            <div className="game-cards-container-preview">
                <div className={("winner-border pastel-yellow")} >
                    <h2 className="text-country-property">
                        <p className="property-label">{translatedModelInfo.capitalCityPopulation[props.language]}:</p>
                        <p className="value-line-tile"><strong>{userCountry.capitalCityPopulation.toLocaleString("de-DE")}</strong></p>
                    </h2>
                </div>

                <div className={("loser-border pastel-yellow")} >
                    <h2 className="text-country-property">
                        <p className="property-label">{translatedModelInfo.capitalCityPopulation[props.language]}:</p>
                        <p className="value-line-tile"><strong>{cpuCountry.capitalCityPopulation.toLocaleString("de-DE")}</strong></p>
                    </h2>
                </div>
            </div>
                <p>Cpu</p>



            <div className="game-cards-container-preview">
                <div className={("tie-border pastel-green")} >
                    <h2 className="text-country-property">
                        <p className="property-label">{translatedModelInfo.forestAreaPercentage[props.language]}:</p>
                        <p className="value-line-tile"><strong>{userCountry.forestAreaPercentage}</strong></p>
                    </h2>
                </div>

                <div className={("tie-border pastel-green")} >
                    <h2 className="text-country-property">
                        <p className="property-label">{translatedModelInfo.forestAreaPercentage[props.language]}:</p>
                        <p className="value-line-tile"><strong>{cpuCountry.forestAreaPercentage}</strong></p>
                    </h2>
                </div>

            </div>
        </>

    )
}