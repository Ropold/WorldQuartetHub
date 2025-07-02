import type {CountryModel} from "./model/CountryModel.ts";
import * as React from "react";
import {useEffect, useState} from "react";
import "./styles/Game.css";
import {translatedCountryNames} from "./utils/TranslatedCountryNames.ts";
import {translatedModelInfo} from "./utils/TranslatedModelInfo.ts";
import {translatedCapitalCities} from "./utils/TranslatedCapitalCities.ts";
import {countryNameToIsoCode, flagImages} from "./utils/FlagImages.ts";
import headerLogo from "../assets/world-quartet-original.jpg"

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

    const [remainingUserCards, setRemainingUserCards] = useState<number>(5);
    const [remainingCpuCards, setRemainingCpuCards] = useState<number>(5);

    const [currentUserCountry, setCurrentUserCountry] = useState<CountryModel | null>(null);
    const [currentCpuCountry, setCurrentCpuCountry] = useState<CountryModel | null>(null);
    const [selectedAttribute, setSelectedAttribute] = useState<keyof CountryModel | null>(null);
    const [tieCountrySave, setTieCountrySave] = useState<CountryModel[]>([]);

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
            setRemainingUserCards(rest.length);
        } else {
            setCurrentUserCountry(null);
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
        }
    }

    function firstCardPick() {
        if (props.cpuCountries.length === 0 || props.userCountries.length === 0) return;
        const [firstUserCard, ...restUserCards] = props.userCountries;
        const [firstCpuCard, ...restCpuCards] = props.cpuCountries;

        setCurrentUserCountry(firstUserCard);
        setCurrentCpuCountry(firstCpuCard);

        props.setUserCountries(restUserCards);
        props.setCpuCountries(restCpuCards);

    }

    useEffect(() => {
        if (remainingUserCards === 0 || remainingCpuCards === 0) {
            props.setGameFinished(true);
            props.setShowWinAnimation(true);
            if (remainingUserCards === 0) {
                console.log("CPU wins the game!");
            } else {
                console.log("User wins the game!");
            }
        }
    }, [remainingUserCards, remainingCpuCards]);

    useEffect(() => {
        setRemainingUserCards((currentUserCountry ? 1 : 0) + props.userCountries.length);
        setRemainingCpuCards((currentCpuCountry ? 1 : 0) + props.cpuCountries.length);
    }, [currentUserCountry, props.userCountries, currentCpuCountry, props.cpuCountries]);


    function compareCurrentCards() {
        if (!currentUserCountry || !currentCpuCountry || !selectedAttribute) return;

        const attr = selectedAttribute;
        const userValue = currentUserCountry[attr];
        const cpuValue = currentCpuCountry[attr];

        if (typeof userValue === "number" && typeof cpuValue === "number") {
            if (userValue > cpuValue) {
                props.setUserCountries(prev => [...prev, currentUserCountry, currentCpuCountry, ...tieCountrySave]);
                setTieCountrySave([]);
            } else if (userValue < cpuValue) {
                props.setCpuCountries(prev => [...prev, currentUserCountry, currentCpuCountry, ...tieCountrySave]);
                props.setLostCardCount(prev => prev + 1);
                setTieCountrySave([]);
            } else {
                setTieCountrySave(prev => [...prev, currentUserCountry, currentCpuCountry]);
                alert("tie")
            }
        }

        if (typeof userValue === "string" && typeof cpuValue === "string") {
            let translatedUserValue = userValue;
            let translatedCpuValue = cpuValue;

            if (selectedAttribute === "capitalCity") {
                translatedUserValue = translatedCapitalCities[currentUserCountry.capitalCity]?.[props.language] || currentUserCountry.capitalCity;
                translatedCpuValue = translatedCapitalCities[currentCpuCountry.capitalCity]?.[props.language] || currentCpuCountry.capitalCity;
            }

            if (selectedAttribute === "countryName") {
                translatedUserValue = translatedCountryNames[currentUserCountry.countryName]?.[props.language] ?? currentUserCountry.countryName;
                translatedCpuValue = translatedCountryNames[currentCpuCountry.countryName]?.[props.language] ?? currentCpuCountry.countryName;
            }

            if (translatedUserValue.length > translatedCpuValue.length) {
                props.setUserCountries(prev => [...prev, currentUserCountry, currentCpuCountry, ...tieCountrySave]);
                setTieCountrySave([]);
            } else if (translatedUserValue.length < translatedCpuValue.length) {
                props.setCpuCountries(prev => [...prev, currentUserCountry, currentCpuCountry, ...tieCountrySave]);
                props.setLostCardCount(prev => prev + 1);
                setTieCountrySave([]);
            } else {
                setTieCountrySave(prev => [...prev, currentUserCountry, currentCpuCountry]);
                alert("tie");
            }
        }


    }

    function handleCheck(){
        if (!selectedAttribute && isRevealed) return;
        setIsRevealed(true);
        compareCurrentCards();
    }

    function handleNextRound() {
        if(selectedAttribute == null) return
        selectNextCpuCountry();
        selectNextUserCountry();
        setIsRevealed(false);
        setSelectedAttribute(null);
    }

    useEffect(() => {
        setRemainingUserCards(props.gameCardCount);
        setRemainingCpuCards(props.gameCardCount);
        props.setLostCardCount(0);
        firstCardPick();
    }, [props.resetSignal]);


    return (
        <>
            <div className="space-between">
                <p>Lost Card Count {props.lostCardCount}</p>
                <p>remainingUserCards {remainingUserCards}</p>
                <p>remainingCpuCards {remainingCpuCards}</p>
            </div>

            <div className="space-between">
                <button className="button-group-button" onClick={handleCheck} disabled={!selectedAttribute || isRevealed}>Check</button>
                <button className="button-group-button" onClick={handleNextRound} disabled={!isRevealed}>Next Round</button>
            </div>


            <div className="game-board-grid">
                {/* USER-CARDS */}
                <div className="game-cards-container">
                    <div className="flag-tile pastel-flag">
                        {currentUserCountry && userFlagSrc && (
                            <div className="flag-wrapper">
                            <img src={userFlagSrc || currentUserCountry.imageUrl || headerLogo} alt={`${currentUserCountry.countryName} flag`}
                                 className="image-flag-tile"/>
                            </div>
                        )}
                    </div>
                    <div   className={"clickable pastel-mint"}
                           id={selectedAttribute === "countryName" ? "selected-attribute" : undefined}
                           onClick={!isRevealed ? () => setSelectedAttribute("countryName") : undefined}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label" >{translatedModelInfo.countryName[props.language]}:</p>
                                <p className="value-line-tile"><strong>{translatedCountryNames[currentUserCountry.countryName]?.[props.language] ?? currentUserCountry.countryName}</strong></p>
                            </h2>
                        )}
                    </div>

                    <div className={"clickable pastel-teal"}
                         id={selectedAttribute === "capitalCity" ? "selected-attribute" : undefined}
                         onClick={!isRevealed ? () => setSelectedAttribute("capitalCity"): undefined}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label">{translatedModelInfo.capitalCity[props.language]}:</p>
                                <p className="value-line-tile"><strong>{translatedCapitalCities[currentUserCountry.capitalCity]?.[props.language] || currentUserCountry.capitalCity}</strong></p>
                            </h2>
                        )}
                    </div>

                    <div className={"clickable pastel-purple"}
                         id={selectedAttribute === "populationInMillions" ? "selected-attribute" : undefined}
                         onClick={!isRevealed ? () => setSelectedAttribute("populationInMillions"): undefined}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label" >{translatedModelInfo.populationInMillions[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.populationInMillions}</strong></p>
                            </h2>
                        )}
                    </div>

                    <div className={"clickable pastel-red"}
                         id={selectedAttribute === "populationDensityPerKm2" ? "selected-attribute" : undefined}
                         onClick={!isRevealed ? () => setSelectedAttribute("populationDensityPerKm2"): undefined}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label" >{translatedModelInfo.populationDensityPerKm2[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.populationDensityPerKm2}</strong> km²</p>
                            </h2>
                        )}
                    </div>

                    <div className={"clickable pastel-yellow"}
                         id={selectedAttribute === "capitalCityPopulation" ? "selected-attribute" : undefined}
                         onClick={!isRevealed ? () => setSelectedAttribute("capitalCityPopulation"): undefined}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label" >{translatedModelInfo.capitalCityPopulation[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.capitalCityPopulation.toLocaleString("de-DE")}</strong></p>
                            </h2>
                        )}
                    </div>

                    <div className={"clickable pastel-orange"}
                         id={selectedAttribute === "gdpPerCapitaInUSD" ? "selected-attribute" : undefined}
                         onClick={!isRevealed ? () => setSelectedAttribute("gdpPerCapitaInUSD"): undefined}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label">{translatedModelInfo.gdpPerCapitaInUSD[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.gdpPerCapitaInUSD.toLocaleString("de-DE")}</strong> $</p>
                            </h2>
                        )}
                    </div>

                    <div className={"clickable pastel-green"}
                         id={selectedAttribute === "forestAreaPercentage" ? "selected-attribute" : undefined}
                         onClick={!isRevealed ? () => setSelectedAttribute("forestAreaPercentage"): undefined}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label">{translatedModelInfo.forestAreaPercentage[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.forestAreaPercentage}</strong> %</p>
                            </h2>
                        )}
                    </div>

                    <div className={"clickable pastel-blue"}
                         id={selectedAttribute === "totalAreaInKm2" ? "selected-attribute" : undefined}
                         onClick={!isRevealed ? () => setSelectedAttribute("totalAreaInKm2"): undefined}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label">{translatedModelInfo.totalAreaInKm2[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.totalAreaInKm2.toLocaleString("de-DE")}</strong> km²</p>
                            </h2>
                        )}
                    </div>

                    <div className={"clickable pastel-gray"}
                         id={selectedAttribute === "roadNetworkLengthInKm" ? "selected-attribute" : undefined}
                         onClick={!isRevealed ? () => setSelectedAttribute("roadNetworkLengthInKm"): undefined}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label">{translatedModelInfo.roadNetworkLengthInKm[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.roadNetworkLengthInKm.toLocaleString("de-DE")}</strong> km</p>
                            </h2>
                        )}
                    </div>

                    <div className={"clickable pastel-brown"}
                         id={selectedAttribute === "averageAnnualTemperatureInC" ? "selected-attribute" : undefined}
                         onClick={!isRevealed ? () => setSelectedAttribute("averageAnnualTemperatureInC"): undefined}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label">{translatedModelInfo.averageAnnualTemperatureInC[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.averageAnnualTemperatureInC}</strong> °C</p>
                            </h2>
                        )}
                    </div>

                    <div className={"clickable pastel-lightblue"}
                         id={selectedAttribute === "annualPrecipitationInMm" ? "selected-attribute" : undefined}
                         onClick={!isRevealed ? () => setSelectedAttribute("annualPrecipitationInMm"): undefined}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label">{translatedModelInfo.annualPrecipitationInMm[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.annualPrecipitationInMm.toLocaleString("de-DE")}</strong> mm</p>
                            </h2>
                        )}
                    </div>
                </div>


                {/* CPU-CARDS */}
                    {!isRevealed ? (
                        <img
                            src={headerLogo}
                            alt="Verdeckt"
                            className="cpu-cover-image"
                        />
                    ) : (
                            <div className="game-cards-container-cpu">
                                <div className="flag-tile pastel-flag">
                                    {currentCpuCountry && (
                                        <div className="flag-wrapper">
                                            <img
                                                src={cpuFlagSrc || currentCpuCountry.imageUrl || headerLogo}
                                                alt={`${currentCpuCountry.countryName} flag`}
                                                className="image-flag-tile"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div
                                    className={"clickable pastel-mint"}
                                    id={selectedAttribute === "countryName" ? "selected-attribute" : undefined}
                                >
                                    {currentCpuCountry && (
                                        <h2 className="text-country-property">
                                            <p className="property-label">{translatedModelInfo.countryName[props.language]}:</p>
                                            <p className="value-line-tile">
                                                <strong>
                                                    {translatedCountryNames[currentCpuCountry.countryName]?.[props.language] ?? currentCpuCountry.countryName}
                                                </strong>
                                            </p>
                                        </h2>
                                    )}
                                </div>

                                <div
                                    className={"clickable pastel-teal"}
                                    id={selectedAttribute === "capitalCity" ? "selected-attribute" : undefined}
                                >
                                    {currentCpuCountry && (
                                        <h2 className="text-country-property">
                                            <p className="property-label">{translatedModelInfo.capitalCity[props.language]}:</p>
                                            <p className="value-line-tile">
                                                <strong>
                                                    {translatedCapitalCities[currentCpuCountry.capitalCity]?.[props.language] || currentCpuCountry.capitalCity}
                                                </strong>
                                            </p>
                                        </h2>
                                    )}
                                </div>

                                <div
                                    className={"clickable pastel-purple"}
                                    id={selectedAttribute === "populationInMillions" ? "selected-attribute" : undefined}
                                >
                                    {currentCpuCountry && (
                                        <h2 className="text-country-property">
                                            <p className="property-label">{translatedModelInfo.populationInMillions[props.language]}:</p>
                                            <p className="value-line-tile">
                                                <strong>{currentCpuCountry.populationInMillions}</strong>
                                            </p>
                                        </h2>
                                    )}
                                </div>

                                <div
                                    className={"clickable pastel-red"}
                                    id={selectedAttribute === "populationDensityPerKm2" ? "selected-attribute" : undefined}
                                >
                                    {currentCpuCountry && (
                                        <h2 className="text-country-property">
                                            <p className="property-label">{translatedModelInfo.populationDensityPerKm2[props.language]}:</p>
                                            <p className="value-line-tile">
                                                <strong>{currentCpuCountry.populationDensityPerKm2}</strong> km²
                                            </p>
                                        </h2>
                                    )}
                                </div>

                                <div
                                    className={"clickable pastel-yellow"}
                                    id={selectedAttribute === "capitalCityPopulation" ? "selected-attribute" : undefined}
                                >
                                    {currentCpuCountry && (
                                        <h2 className="text-country-property">
                                            <p className="property-label">{translatedModelInfo.capitalCityPopulation[props.language]}:</p>
                                            <p className="value-line-tile">
                                                <strong>{currentCpuCountry.capitalCityPopulation.toLocaleString("de-DE")}</strong>
                                            </p>
                                        </h2>
                                    )}
                                </div>

                                <div
                                    className={"clickable pastel-orange"}
                                    id={selectedAttribute === "gdpPerCapitaInUSD" ? "selected-attribute" : undefined}
                                >
                                    {currentCpuCountry && (
                                        <h2 className="text-country-property">
                                            <p className="property-label">{translatedModelInfo.gdpPerCapitaInUSD[props.language]}:</p>
                                            <p className="value-line-tile">
                                                <strong>{currentCpuCountry.gdpPerCapitaInUSD.toLocaleString("de-DE")}</strong> $
                                            </p>
                                        </h2>
                                    )}
                                </div>

                                <div
                                    className={"clickable pastel-green"}
                                    id={selectedAttribute === "forestAreaPercentage" ? "selected-attribute" : undefined}
                                >
                                    {currentCpuCountry && (
                                        <h2 className="text-country-property">
                                            <p className="property-label">{translatedModelInfo.forestAreaPercentage[props.language]}:</p>
                                            <p className="value-line-tile">
                                                <strong>{currentCpuCountry.forestAreaPercentage}</strong> %
                                            </p>
                                        </h2>
                                    )}
                                </div>

                                <div
                                    className={"clickable pastel-blue"}
                                    id={selectedAttribute === "totalAreaInKm2" ? "selected-attribute" : undefined}
                                >
                                    {currentCpuCountry && (
                                        <h2 className="text-country-property">
                                            <p className="property-label">{translatedModelInfo.totalAreaInKm2[props.language]}:</p>
                                            <p className="value-line-tile">
                                                <strong>{currentCpuCountry.totalAreaInKm2.toLocaleString("de-DE")}</strong> km²
                                            </p>
                                        </h2>
                                    )}
                                </div>

                                <div
                                    className={"clickable pastel-gray"}
                                    id={selectedAttribute === "roadNetworkLengthInKm" ? "selected-attribute" : undefined}
                                >
                                    {currentCpuCountry && (
                                        <h2 className="text-country-property">
                                            <p className="property-label">{translatedModelInfo.roadNetworkLengthInKm[props.language]}:</p>
                                            <p className="value-line-tile">
                                                <strong>{currentCpuCountry.roadNetworkLengthInKm.toLocaleString("de-DE")}</strong> km
                                            </p>
                                        </h2>
                                    )}
                                </div>

                                <div
                                    className={"clickable pastel-brown"}
                                    id={selectedAttribute === "averageAnnualTemperatureInC" ? "selected-attribute" : undefined}
                                >
                                    {currentCpuCountry && (
                                        <h2 className="text-country-property">
                                            <p className="property-label">{translatedModelInfo.averageAnnualTemperatureInC[props.language]}:</p>
                                            <p className="value-line-tile">
                                                <strong>{currentCpuCountry.averageAnnualTemperatureInC}</strong> °C
                                            </p>
                                        </h2>
                                    )}
                                </div>

                                <div
                                    className={"clickable pastel-lightblue"}
                                    id={selectedAttribute === "annualPrecipitationInMm" ? "selected-attribute" : undefined}
                                >
                                    {currentCpuCountry && (
                                        <h2 className="text-country-property">
                                            <p className="property-label">{translatedModelInfo.annualPrecipitationInMm[props.language]}:</p>
                                            <p className="value-line-tile">
                                                <strong>{currentCpuCountry.annualPrecipitationInMm.toLocaleString("de-DE")}</strong> mm
                                            </p>
                                        </h2>
                                    )}
                                </div>
                            </div>
                    )}
                </div>
        </>
    )
}