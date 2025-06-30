import type {CountryModel} from "./model/CountryModel.ts";
import * as React from "react";
import {useEffect, useState} from "react";
import headerLogo from "../assets/world-quartet-original.jpg";
import "./styles/Game.css";
import {translatedCountryNames} from "./utils/TranslatedCountryNames.ts";
import {translatedModelInfo} from "./utils/TranslatedModelInfo.ts";
import {translatedCapitalCities} from "./utils/TranslatedCapitalCities.ts";
import {countryNameToIsoCode, flagImages} from "./utils/FlagImages.ts";
import capitalCityLogo from "../assets/country-model/capitalCity.jpg";
import populationInMillionsLogo from "../assets/country-model/populationInMillions.jpg";
import populationDensityPerKm2Logo from "../assets/country-model/populationDensityPerKm2.jpg";
import capitalCityPopulationLogo from "../assets/country-model/capitalCityPopulation.jpg";
import gdpPerCapitaInUSDLogo from "../assets/country-model/gdpPerCapitaInUSD.jpg";
import forestAreaPercentageLogo from "../assets/country-model/forestAreaPercentage.jpg";
import totalAreaInKm2Logo from "../assets/country-model/totalAreaInKm2.jpg";
import roadNetworkLengthInKmLogo from "../assets/country-model/roadNetworkLengthInKm.jpg";
import averageAnnualTemperatureInCLogo from "../assets/country-model/averageAnnualTemperatureInC.jpg";
import annualPrecipitationInMmLogo from "../assets/country-model/annualPrecipitationInMm.jpg";

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
                    <div className="clickable-country-property-div">
                        {currentUserCountry && userFlagSrc && (
                            <img src={userFlagSrc} alt={`${currentUserCountry.countryName} flag`}
                                 className="logo-image-game"/>
                        )}
                    </div>
                    <div   className={`clickable-country-property-div ${selectedAttribute === "countryName" ? "selected-attribute" : ""}`}
                         onClick={() => setSelectedAttribute("countryName")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                {translatedCountryNames[currentUserCountry.countryName]?.[props.language] ?? currentUserCountry.countryName}
                            </h2>
                        )}
                        <img src={headerLogo} alt="All Countries Logo" className="logo-image-game"/>
                    </div>

                    <div className={`clickable-country-property-div ${selectedAttribute === "capitalCity" ? "selected-attribute" : ""}`}
                         onClick={() => setSelectedAttribute("capitalCity")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <strong>{translatedModelInfo.capitalCity[props.language]}</strong>: {translatedCapitalCities[currentUserCountry.capitalCity]?.[props.language] || currentUserCountry.capitalCity}
                            </h2>
                        )}
                        <img src={capitalCityLogo} alt="All Countries Logo" className="logo-image-game"/>
                    </div>

                    <div className={`clickable-country-property-div ${selectedAttribute === "populationInMillions" ? "selected-attribute" : ""}`}
                         onClick={() => setSelectedAttribute("populationInMillions")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <strong>{translatedModelInfo.populationInMillions[props.language]}</strong>: {currentUserCountry.populationInMillions}
                            </h2>
                        )}
                        <img src={populationInMillionsLogo} alt="All Countries Logo" className="logo-image-game"/>
                    </div>

                    <div className={`clickable-country-property-div ${selectedAttribute === "populationDensityPerKm2" ? "selected-attribute" : ""}`}
                         onClick={() => setSelectedAttribute("populationDensityPerKm2")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <strong>{translatedModelInfo.populationDensityPerKm2[props.language]}</strong>: {currentUserCountry.populationDensityPerKm2}
                            </h2>
                        )}
                        <img src={populationDensityPerKm2Logo} alt="All Countries Logo" className="logo-image-game"/>
                    </div>

                    <div className={`clickable-country-property-div ${selectedAttribute === "capitalCityPopulation" ? "selected-attribute" : ""}`}
                         onClick={() => setSelectedAttribute("capitalCityPopulation")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <strong>{translatedModelInfo.capitalCityPopulation[props.language]}</strong>: {currentUserCountry.capitalCityPopulation.toLocaleString("de-DE")}
                            </h2>
                        )}
                        <img src={capitalCityPopulationLogo} alt="All Countries Logo" className="logo-image-game"/>
                    </div>

                    <div className={`clickable-country-property-div ${selectedAttribute === "gdpPerCapitaInUSD" ? "selected-attribute" : ""}`}
                         onClick={() => setSelectedAttribute("gdpPerCapitaInUSD")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <strong>{translatedModelInfo.gdpPerCapitaInUSD[props.language]}</strong>: {currentUserCountry.gdpPerCapitaInUSD.toLocaleString("de-DE")}
                            </h2>
                        )}
                        <img src={gdpPerCapitaInUSDLogo} alt="All Countries Logo" className="logo-image-game"/>
                    </div>

                    <div className={`clickable-country-property-div ${selectedAttribute === "forestAreaPercentage" ? "selected-attribute" : ""}`}
                         onClick={() => setSelectedAttribute("forestAreaPercentage")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <strong>{translatedModelInfo.forestAreaPercentage[props.language]}</strong>: {currentUserCountry.forestAreaPercentage}
                            </h2>
                        )}
                        <img src={forestAreaPercentageLogo} alt="All Countries Logo" className="logo-image-game"/>
                    </div>

                    <div className={`clickable-country-property-div ${selectedAttribute === "totalAreaInKm2" ? "selected-attribute" : ""}`}
                         onClick={() => setSelectedAttribute("totalAreaInKm2")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <strong>{translatedModelInfo.totalAreaInKm2[props.language]}</strong>: {currentUserCountry.totalAreaInKm2.toLocaleString("de-DE")}
                            </h2>
                        )}
                        <img src={totalAreaInKm2Logo} alt="All Countries Logo" className="logo-image-game"/>
                    </div>

                    <div className={`clickable-country-property-div ${selectedAttribute === "roadNetworkLengthInKm" ? "selected-attribute" : ""}`}
                         onClick={() => setSelectedAttribute("roadNetworkLengthInKm")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <strong>{translatedModelInfo.roadNetworkLengthInKm[props.language]}</strong>: {currentUserCountry.roadNetworkLengthInKm.toLocaleString("de-DE")}
                            </h2>
                        )}
                        <img src={roadNetworkLengthInKmLogo} alt="All Countries Logo" className="logo-image-game"/>
                    </div>

                    <div className={`clickable-country-property-div ${selectedAttribute === "averageAnnualTemperatureInC" ? "selected-attribute" : ""}`}
                         onClick={() => setSelectedAttribute("averageAnnualTemperatureInC")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <strong>{translatedModelInfo.averageAnnualTemperatureInC[props.language]}</strong>: {currentUserCountry.averageAnnualTemperatureInC}
                            </h2>
                        )}
                        <img src={averageAnnualTemperatureInCLogo} alt="All Countries Logo" className="logo-image-game"/>
                    </div>

                    <div className={`clickable-country-property-div ${selectedAttribute === "annualPrecipitationInMm" ? "selected-attribute" : ""}`}
                         onClick={() => setSelectedAttribute("annualPrecipitationInMm")}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <strong>{translatedModelInfo.annualPrecipitationInMm[props.language]}</strong>: {currentUserCountry.annualPrecipitationInMm.toLocaleString("de-DE")}
                            </h2>
                        )}
                        <img src={annualPrecipitationInMmLogo} alt="All Countries Logo" className="logo-image-game"/>
                    </div>
                </div>

                {/* CPU-CARDS */}
                <div className="game-cards-container-cpu">
                    <div className="clickable-country-property-div-cpu">
                        {currentCpuCountry && (
                            <h2 className="text-country-property-cpu">
                                {translatedCountryNames[currentCpuCountry.countryName]?.[props.language] ?? currentCpuCountry.countryName}
                            </h2>
                        )}
                        <img src={headerLogo} alt="All Countries Logo" className="logo-image-game"/>
                    </div>

                    <div className="clickable-country-property-div-cpu">
                        {currentCpuCountry && (
                            <h2 className="text-country-property-cpu">
                                <strong>{translatedModelInfo.capitalCity[props.language]}</strong>: {translatedCapitalCities[currentCpuCountry.capitalCity]?.[props.language] || currentCpuCountry.capitalCity}
                            </h2>
                        )}
                        <img src={capitalCityLogo} alt="All Countries Logo" className="logo-image-game"/>
                    </div>

                    <div className="clickable-country-property-div-cpu">
                        {currentCpuCountry && cpuFlagSrc && (
                            <img src={cpuFlagSrc} alt={`${currentCpuCountry.countryName} flag`}
                                 className="logo-image-game"/>
                        )}
                    </div>

                    <div className="clickable-country-property-div-cpu">
                        {currentCpuCountry && (
                            <h2 className="text-country-property-cpu">
                                <strong>{translatedModelInfo.populationInMillions[props.language]}</strong>: {currentCpuCountry.populationInMillions}
                            </h2>
                        )}
                        <img src={populationInMillionsLogo} alt="All Countries Logo" className="logo-image-game"/>
                    </div>

                    <div className="clickable-country-property-div-cpu">
                        {currentCpuCountry && (
                            <h2 className="text-country-property-cpu">
                                <strong>{translatedModelInfo.populationDensityPerKm2[props.language]}</strong>: {currentCpuCountry.populationDensityPerKm2}
                            </h2>
                        )}
                        <img src={populationDensityPerKm2Logo} alt="All Countries Logo" className="logo-image-game"/>
                    </div>

                    <div className="clickable-country-property-div-cpu">
                        {currentCpuCountry && (
                            <h2 className="text-country-property-cpu">
                                <strong>{translatedModelInfo.capitalCityPopulation[props.language]}</strong>: {currentCpuCountry.capitalCityPopulation.toLocaleString("de-DE")}
                            </h2>
                        )}
                        <img src={capitalCityPopulationLogo} alt="All Countries Logo" className="logo-image-game"/>
                    </div>

                    <div className="clickable-country-property-div-cpu">
                        {currentCpuCountry && (
                            <h2 className="text-country-property-cpu">
                                <strong>{translatedModelInfo.gdpPerCapitaInUSD[props.language]}</strong>: {currentCpuCountry.gdpPerCapitaInUSD.toLocaleString("de-DE")}
                            </h2>
                        )}
                        <img src={gdpPerCapitaInUSDLogo} alt="All Countries Logo" className="logo-image-game"/>
                    </div>

                    <div className="clickable-country-property-div-cpu">
                        {currentCpuCountry && (
                            <h2 className="text-country-property-cpu">
                                <strong>{translatedModelInfo.forestAreaPercentage[props.language]}</strong>: {currentCpuCountry.forestAreaPercentage}
                            </h2>
                        )}
                        <img src={forestAreaPercentageLogo} alt="All Countries Logo" className="logo-image-game"/>
                    </div>

                    <div className="clickable-country-property-div-cpu">
                        {currentCpuCountry && (
                            <h2 className="text-country-property-cpu">
                                <strong>{translatedModelInfo.totalAreaInKm2[props.language]}</strong>: {currentCpuCountry.totalAreaInKm2.toLocaleString("de-DE")}
                            </h2>
                        )}
                        <img src={totalAreaInKm2Logo} alt="All Countries Logo" className="logo-image-game"/>
                    </div>

                    <div className="clickable-country-property-div-cpu">
                        {currentCpuCountry && (
                            <h2 className="text-country-property-cpu">
                                <strong>{translatedModelInfo.roadNetworkLengthInKm[props.language]}</strong>: {currentCpuCountry.roadNetworkLengthInKm.toLocaleString("de-DE")}
                            </h2>
                        )}
                        <img src={roadNetworkLengthInKmLogo} alt="All Countries Logo" className="logo-image-game"/>
                    </div>

                    <div className="clickable-country-property-div-cpu">
                        {currentCpuCountry && (
                            <h2 className="text-country-property-cpu">
                                <strong>{translatedModelInfo.averageAnnualTemperatureInC[props.language]}</strong>: {currentCpuCountry.averageAnnualTemperatureInC}
                            </h2>
                        )}
                        <img src={averageAnnualTemperatureInCLogo} alt="All Countries Logo" className="logo-image-game"/>
                    </div>

                    <div className="clickable-country-property-div-cpu">
                        {currentCpuCountry && (
                            <h2 className="text-country-property-cpu">
                                <strong>{translatedModelInfo.annualPrecipitationInMm[props.language]}</strong>: {currentCpuCountry.annualPrecipitationInMm.toLocaleString("de-DE")}
                            </h2>
                        )}
                        <img src={annualPrecipitationInMmLogo} alt="All Countries Logo" className="logo-image-game"/>
                    </div>
                </div>
            </div>
        </>
    );
}