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
                    <div className="flag-tile pastel-flag">
                        {currentUserCountry && userFlagSrc && (
                            <img src={userFlagSrc} alt={`${currentUserCountry.countryName} flag`}
                                 className="image-flag-tile"/>
                        )}
                    </div>
                    <div   className={"clickable pastel-mint"}
                           id={selectedAttribute === "countryName" ? "selected-attribute" : undefined}
                           onClick={() => setSelectedAttribute("countryName")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label" >{translatedModelInfo.countryName[props.language]}:</p>
                                <p className="value-line-tile"><strong>{translatedCountryNames[currentUserCountry.countryName]?.[props.language] ?? currentUserCountry.countryName}</strong></p>
                            </h2>
                        )}
                    </div>

                    <div className={"clickable pastel-teal"}
                         id={selectedAttribute === "capitalCity" ? "selected-attribute" : undefined}
                         onClick={() => setSelectedAttribute("capitalCity")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label">{translatedModelInfo.capitalCity[props.language]}:</p>
                                <p className="value-line-tile"><strong>{translatedCapitalCities[currentUserCountry.capitalCity]?.[props.language] || currentUserCountry.capitalCity}</strong></p>
                            </h2>
                        )}
                    </div>

                    <div className={"clickable pastel-purple"}
                         id={selectedAttribute === "populationInMillions" ? "selected-attribute" : undefined}
                         onClick={() => setSelectedAttribute("populationInMillions")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label" >{translatedModelInfo.populationInMillions[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.populationInMillions}</strong></p>
                            </h2>
                        )}
                    </div>

                    <div className={"clickable pastel-red"}
                         id={selectedAttribute === "populationDensityPerKm2" ? "selected-attribute" : undefined}
                         onClick={() => setSelectedAttribute("populationDensityPerKm2")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label" >{translatedModelInfo.populationDensityPerKm2[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.populationDensityPerKm2}</strong> km²</p>
                            </h2>
                        )}
                    </div>

                    <div className={"clickable pastel-yellow"}
                         id={selectedAttribute === "capitalCityPopulation" ? "selected-attribute" : undefined}
                         onClick={() => setSelectedAttribute("capitalCityPopulation")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label" >{translatedModelInfo.capitalCityPopulation[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.capitalCityPopulation.toLocaleString("de-DE")}</strong></p>
                            </h2>
                        )}
                    </div>

                    <div className={"clickable pastel-orange"}
                         id={selectedAttribute === "gdpPerCapitaInUSD" ? "selected-attribute" : undefined}
                         onClick={() => setSelectedAttribute("gdpPerCapitaInUSD")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label">{translatedModelInfo.gdpPerCapitaInUSD[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.gdpPerCapitaInUSD.toLocaleString("de-DE")}</strong> $</p>
                            </h2>
                        )}
                    </div>

                    <div className={"clickable pastel-green"}
                         id={selectedAttribute === "forestAreaPercentage" ? "selected-attribute" : undefined}
                         onClick={() => setSelectedAttribute("forestAreaPercentage")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label">{translatedModelInfo.forestAreaPercentage[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.forestAreaPercentage}</strong> %</p>
                            </h2>
                        )}
                    </div>

                    <div className={"clickable pastel-blue"}
                         id={selectedAttribute === "totalAreaInKm2" ? "selected-attribute" : undefined}
                         onClick={() => setSelectedAttribute("totalAreaInKm2")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label">{translatedModelInfo.totalAreaInKm2[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.totalAreaInKm2.toLocaleString("de-DE")}</strong> km²</p>
                            </h2>
                        )}
                    </div>

                    <div className={"clickable pastel-gray"}
                         id={selectedAttribute === "roadNetworkLengthInKm" ? "selected-attribute" : undefined}
                         onClick={() => setSelectedAttribute("roadNetworkLengthInKm")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label">{translatedModelInfo.roadNetworkLengthInKm[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.roadNetworkLengthInKm.toLocaleString("de-DE")}</strong> km</p>
                            </h2>
                        )}
                    </div>

                    <div className={"clickable pastel-brown"}
                         id={selectedAttribute === "averageAnnualTemperatureInC" ? "selected-attribute" : undefined}
                         onClick={() => setSelectedAttribute("averageAnnualTemperatureInC")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label">{translatedModelInfo.averageAnnualTemperatureInC[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.averageAnnualTemperatureInC}</strong> °C</p>
                            </h2>
                        )}
                    </div>

                    <div className={"clickable pastel-lightblue"}
                         id={selectedAttribute === "annualPrecipitationInMm" ? "selected-attribute" : undefined}
                         onClick={() => setSelectedAttribute("annualPrecipitationInMm")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label">{translatedModelInfo.annualPrecipitationInMm[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.annualPrecipitationInMm.toLocaleString("de-DE")}</strong> mm</p>
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
                                 className=""/>
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