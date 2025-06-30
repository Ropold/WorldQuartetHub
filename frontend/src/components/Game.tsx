import type {CountryModel} from "./model/CountryModel.ts";
import * as React from "react";
import {useEffect, useState} from "react";
import "./styles/Game.css";
import {translatedCountryNames} from "./utils/TranslatedCountryNames.ts";
import {translatedModelInfo} from "./utils/TranslatedModelInfo.ts";
import {translatedCapitalCities} from "./utils/TranslatedCapitalCities.ts";
import {countryNameToIsoCode, flagImages} from "./utils/FlagImages.ts";

type GameProps = {
    userCountries: CountryModel[];
    setUserCountries: React.Dispatch<React.SetStateAction<CountryModel[]>>
    cpuCountries: CountryModel[];
    setCpuCountries: React.Dispatch<React.SetStateAction<CountryModel[]>>;
    setGameFinished: React.Dispatch<React.SetStateAction<boolean>>;
    lostCardCount: number;
    setLostCardCount: React.Dispatch<React.SetStateAction<number>>;
    setShowWinAnimation: React.Dispatch<React.SetStateAction<boolean>>;
    resetSignal:number;
    gameCardCount: number;
    language: string;
}

export default function Game(props: Readonly<GameProps>) {

    const [remainingPlayerCards, setRemainingPlayerCards] = useState<number>(5);
    const [remainingCpuCards, setRemainingCpuCards] = useState<number>(5);

    const [currentUserCountry, setCurrentUserCountry] = useState<CountryModel | null>(null);
    const [currentCpuCountry, setCurrentCpuCountry] = useState<CountryModel | null>(null);
    const [selectedAttribute, setSelectedAttribute] = useState<keyof CountryModel | null>(null);

    const [isRevealed, setIsRevealed] = useState<boolean>(false);

    const userIsoCode = currentUserCountry ? countryNameToIsoCode[currentUserCountry.countryName] : null;
    const cpuIsoCode = currentCpuCountry ? countryNameToIsoCode[currentCpuCountry.countryName] : null;

    const userFlagSrc = userIsoCode ? flagImages[userIsoCode] : null;
    const cpuFlagSrc = cpuIsoCode ? flagImages[cpuIsoCode] : null;


    function selectNextUserCountry() {
        if (props.userCountries.length > 0) {
            const [next, ...rest] = props.userCountries;
            setCurrentUserCountry(next);
            props.setUserCountries(rest);
            setRemainingPlayerCards(rest.length);
        } else {
            setCurrentUserCountry(null);
            setRemainingPlayerCards(0);
            props.setGameFinished(true);
        }
    }

    function selectNextCpuCountry() {
        if (props.cpuCountries.length > 0) {
            const [next, ...rest] = props.cpuCountries;
            setCurrentCpuCountry(next);
            props.setCpuCountries(rest);
            setRemainingCpuCards(rest.length);
        } else {
            setCurrentCpuCountry(null);
            setRemainingCpuCards(0);
            props.setGameFinished(true);
        }
    }

    useEffect(() => {
        setRemainingPlayerCards(props.gameCardCount);
        setRemainingCpuCards(props.gameCardCount);
        props.setLostCardCount(0);
    }, [props.resetSignal]);

    function handleNextRound() {
        selectNextCpuCountry();
        selectNextUserCountry();
    }

    return (
        <>
            <h2>Game</h2>

            <div className="space-between">
                <p>Lost Card Count {props.lostCardCount}</p>
                <p>remainingPlayerCards {remainingPlayerCards}</p>
                <p>remainingCpuCards {remainingCpuCards}</p>
            </div>

            <div>
                <button className="button-group-button" onClick={handleNextRound}>Next Round</button>
            </div>


            <div className="game-board-grid">
                {/* USER-CARDS */}
                <div className="game-cards-container">
                    <div className="clickable pastel-flag">
                        {currentUserCountry && userFlagSrc && (
                            <img src={userFlagSrc} alt={`${currentUserCountry.countryName} flag`}
                                 className="logo-image-tile-flag"/>
                        )}
                    </div>
                    <div className={`clickable pastel-mint ${selectedAttribute === "countryName" ? "selected-attribute" : ""}`}
                         onClick={() => setSelectedAttribute("countryName")}>
                        {currentUserCountry && (
                            <div>
                            <h2 className="text-country-property">
                                <p>{translatedModelInfo.countryName[props.language]}:</p>
                                <p><strong>{translatedCountryNames[currentUserCountry.countryName]?.[props.language] ?? currentUserCountry.countryName}</strong></p>
                            </h2>
                            </div>
                        )}

                    </div>

                    <div className={`clickable pastel-teal ${selectedAttribute === "capitalCity" ? "selected-attribute" : ""}`}
                         onClick={() => setSelectedAttribute("capitalCity")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p>{translatedModelInfo.capitalCity[props.language]}:</p>
                                <p><strong>{translatedCapitalCities[currentUserCountry.capitalCity]?.[props.language] || currentUserCountry.capitalCity}</strong></p>
                            </h2>
                        )}
                    </div>

                    <div className={`clickable pastel-purple ${selectedAttribute === "populationInMillions" ? "selected-attribute" : ""}`}
                         onClick={() => setSelectedAttribute("populationInMillions")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p>{translatedModelInfo.populationInMillions[props.language]}:</p>
                                <p><strong>{currentUserCountry.populationInMillions}</strong></p>
                            </h2>
                        )}
                    </div>

                    <div className={`clickable pastel-red ${selectedAttribute === "populationDensityPerKm2" ? "selected-attribute" : ""}`}
                         onClick={() => setSelectedAttribute("populationDensityPerKm2")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p>{translatedModelInfo.populationDensityPerKm2[props.language]}:</p>
                                <p><strong>{currentUserCountry.populationDensityPerKm2}</strong></p>
                            </h2>
                        )}
                    </div>

                    <div className={`clickable pastel-yellow ${selectedAttribute === "capitalCityPopulation" ? "selected-attribute" : ""}`}
                         onClick={() => setSelectedAttribute("capitalCityPopulation")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p>{translatedModelInfo.capitalCityPopulation[props.language]}:</p>
                                <p><strong>{currentUserCountry.capitalCityPopulation.toLocaleString("de-DE")}</strong></p>
                            </h2>
                        )}
                    </div>

                    <div className={`clickable pastel-orange ${selectedAttribute === "gdpPerCapitaInUSD" ? "selected-attribute" : ""}`}
                         onClick={() => setSelectedAttribute("gdpPerCapitaInUSD")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p>{translatedModelInfo.gdpPerCapitaInUSD[props.language]}:</p>
                                <p><strong>{currentUserCountry.gdpPerCapitaInUSD.toLocaleString("de-DE")}</strong></p>
                            </h2>
                        )}
                    </div>

                    <div className={`clickable pastel-green ${selectedAttribute === "forestAreaPercentage" ? "selected-attribute" : ""}`}
                         onClick={() => setSelectedAttribute("forestAreaPercentage")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p>{translatedModelInfo.forestAreaPercentage[props.language]}:</p>
                                <p><strong>{currentUserCountry.forestAreaPercentage}</strong></p>
                            </h2>
                        )}
                    </div>

                    <div className={`clickable pastel-blue ${selectedAttribute === "totalAreaInKm2" ? "selected-attribute" : ""}`}
                         onClick={() => setSelectedAttribute("totalAreaInKm2")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p>{translatedModelInfo.totalAreaInKm2[props.language]}:</p>
                                <p><strong>{currentUserCountry.totalAreaInKm2.toLocaleString("de-DE")}</strong></p>
                            </h2>
                        )}
                    </div>

                    <div className={`clickable pastel-gray ${selectedAttribute === "roadNetworkLengthInKm" ? "selected-attribute" : ""}`}
                         onClick={() => setSelectedAttribute("roadNetworkLengthInKm")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p>{translatedModelInfo.roadNetworkLengthInKm[props.language]}:</p>
                                <p><strong>{currentUserCountry.roadNetworkLengthInKm.toLocaleString("de-DE")}</strong></p>
                            </h2>
                        )}
                    </div>

                    <div className={`clickable pastel-brown ${selectedAttribute === "averageAnnualTemperatureInC" ? "selected-attribute" : ""}`}
                         onClick={() => setSelectedAttribute("averageAnnualTemperatureInC")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p>{translatedModelInfo.averageAnnualTemperatureInC[props.language]}:</p>
                                <p><strong>{currentUserCountry.averageAnnualTemperatureInC}</strong></p>
                            </h2>
                        )}
                    </div>

                    <div className={`clickable pastel-lightblue ${selectedAttribute === "annualPrecipitationInMm" ? "selected-attribute" : ""}`}
                         onClick={() => setSelectedAttribute("annualPrecipitationInMm")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p>{translatedModelInfo.annualPrecipitationInMm[props.language]}:</p>
                                <p><strong>{currentUserCountry.annualPrecipitationInMm.toLocaleString("de-DE")}</strong></p>
                            </h2>
                        )}
                    </div>
                </div>

                {/* CPU-CARDS */}
                <div className="game-cards-container-cpu">
                    <div className="clickable-cpu">
                        {currentCpuCountry && (
                            <h2 className="text-country-property-cpu">
                                {translatedCountryNames[currentCpuCountry.countryName]?.[props.language] ?? currentCpuCountry.countryName}
                            </h2>
                        )}
                    </div>

                    <div className="clickable-cpu">
                        {currentCpuCountry && (
                            <h2 className="text-country-property-cpu">
                                <strong>{translatedModelInfo.capitalCity[props.language]}</strong>: {translatedCapitalCities[currentCpuCountry.capitalCity]?.[props.language] || currentCpuCountry.capitalCity}
                            </h2>
                        )}
                    </div>

                    <div className="clickable-cpu">
                        {currentCpuCountry && cpuFlagSrc && (
                            <img src={cpuFlagSrc} alt={`${currentCpuCountry.countryName} flag`}
                                 className="logo-image-country-name"/>
                        )}
                    </div>

                    <div className="clickable-cpu">
                        {currentCpuCountry && (
                            <h2 className="text-country-property-cpu">
                                <strong>{translatedModelInfo.populationInMillions[props.language]}</strong>: {currentCpuCountry.populationInMillions}
                            </h2>
                        )}
                    </div>

                    <div className="clickable-cpu">
                        {currentCpuCountry && (
                            <h2 className="text-country-property-cpu">
                                <strong>{translatedModelInfo.populationDensityPerKm2[props.language]}</strong>: {currentCpuCountry.populationDensityPerKm2}
                            </h2>
                        )}
                    </div>

                    <div className="clickable-cpu">
                        {currentCpuCountry && (
                            <h2 className="text-country-property-cpu">
                                <strong>{translatedModelInfo.capitalCityPopulation[props.language]}</strong>: {currentCpuCountry.capitalCityPopulation.toLocaleString("de-DE")}
                            </h2>
                        )}
                    </div>

                    <div className="clickable-cpu">
                        {currentCpuCountry && (
                            <h2 className="text-country-property-cpu">
                                <strong>{translatedModelInfo.gdpPerCapitaInUSD[props.language]}</strong>: {currentCpuCountry.gdpPerCapitaInUSD.toLocaleString("de-DE")}
                            </h2>
                        )}
                    </div>

                    <div className="clickable-cpu">
                        {currentCpuCountry && (
                            <h2 className="text-country-property-cpu">
                                <strong>{translatedModelInfo.forestAreaPercentage[props.language]}</strong>: {currentCpuCountry.forestAreaPercentage}
                            </h2>
                        )}
                    </div>

                    <div className="clickable-cpu">
                        {currentCpuCountry && (
                            <h2 className="text-country-property-cpu">
                                <strong>{translatedModelInfo.totalAreaInKm2[props.language]}</strong>: {currentCpuCountry.totalAreaInKm2.toLocaleString("de-DE")}
                            </h2>
                        )}
                    </div>

                    <div className="clickable-cpu">
                        {currentCpuCountry && (
                            <h2 className="text-country-property-cpu">
                                <strong>{translatedModelInfo.roadNetworkLengthInKm[props.language]}</strong>: {currentCpuCountry.roadNetworkLengthInKm.toLocaleString("de-DE")}
                            </h2>
                        )}
                    </div>

                    <div className="clickable-cpu">
                        {currentCpuCountry && (
                            <h2 className="text-country-property-cpu">
                                <strong>{translatedModelInfo.averageAnnualTemperatureInC[props.language]}</strong>: {currentCpuCountry.averageAnnualTemperatureInC}
                            </h2>
                        )}
                    </div>

                    <div className="clickable-cpu">
                        {currentCpuCountry && (
                            <h2 className="text-country-property-cpu">
                                <strong>{translatedModelInfo.annualPrecipitationInMm[props.language]}</strong>: {currentCpuCountry.annualPrecipitationInMm.toLocaleString("de-DE")}
                            </h2>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}