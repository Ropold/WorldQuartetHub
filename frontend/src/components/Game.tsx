import type {CountryModel} from "./model/CountryModel.ts";
import * as React from "react";
import {useEffect, useState} from "react";
import "./styles/Game.css";
import {translatedCountryNames} from "./utils/TranslatedCountryNames.ts";
import {translatedModelInfo} from "./utils/TranslatedModelInfo.ts";
import {translatedCapitalCities} from "./utils/TranslatedCapitalCities.ts";
import {countryNameToIsoCode, flagImages} from "./utils/FlagImages.ts";
import headerLogo from "../assets/world-quartet-original.jpg"
import userLogo from "../assets/user.jpg"
import cpuLogo from "../assets/cpu.jpg"
import lostCardsLogo from "../assets/lost-cards.jpg"
import roundWinner from "../assets/round-winner.svg";
import {translatedGameInfo} from "./utils/TranslatedGameInfo.ts";
import {regionImages} from "./utils/RegionImages.ts";

type WinnerType = "user" | "cpu" | "" ;
type RoundResult = "user" | "cpu" | "tie" | "idle";

type GameProps = {
    userCountries: CountryModel[];
    setUserCountries: React.Dispatch<React.SetStateAction<CountryModel[]>>
    cpuCountries: CountryModel[];
    setCpuCountries: React.Dispatch<React.SetStateAction<CountryModel[]>>;
    gameFinished: boolean;
    setGameFinished: React.Dispatch<React.SetStateAction<boolean>>;
    lostCardCount: number;
    setLostCardCount: React.Dispatch<React.SetStateAction<number>>;
    setShowWinAnimation: React.Dispatch<React.SetStateAction<boolean>>;
    resetSignal:number;
    gameCardCount: number;
    language: string;
    winner: string;
    setWinner: React.Dispatch<React.SetStateAction<WinnerType>>;
    setShowLastCards: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Game(props: Readonly<GameProps>) {

    const [lastUserCard, setLastUserCard] = useState <boolean>(false);
    const [lastCpuCard, setLastCpuCard] = useState <boolean>(false);
    const [userCardCount, setUserCardCount] = useState<number>(0);
    const [cpuCardCount, setCpuCardCount] = useState<number>(0);
    const [roundResult, setRoundResult] = useState<RoundResult>("idle");
    const [isRevealed, setIsRevealed] = useState<boolean>(false);

    const [currentUserCountry, setCurrentUserCountry] = useState<CountryModel | null>(null);
    const [currentCpuCountry, setCurrentCpuCountry] = useState<CountryModel | null>(null);
    const [selectedAttribute, setSelectedAttribute] = useState<keyof CountryModel | null>(null);
    const [tieCountrySave, setTieCountrySave] = useState<CountryModel[]>([]);

    const userIsoCode = currentUserCountry ? countryNameToIsoCode[currentUserCountry.countryName] : null;
    const cpuIsoCode = currentCpuCountry ? countryNameToIsoCode[currentCpuCountry.countryName] : null;

    const userFlagSrc = userIsoCode ? flagImages[userIsoCode] : null;
    const regionSrc = userIsoCode ? regionImages[userIsoCode] : null;
    const cpuFlagSrc = cpuIsoCode ? flagImages[cpuIsoCode] : null;


    function selectNextUserCountry() {
        if (props.userCountries.length > 0) {
            const [next, ...rest] = props.userCountries;
            setCurrentUserCountry(next);
            props.setUserCountries(rest);
            if (rest.length === 0) {
                setLastUserCard(true);
            } else {
                setLastUserCard(false);
            }
        } else {
            setCurrentUserCountry(null);
            setLastUserCard(false);
        }
    }

    function selectNextCpuCountry() {
        if (props.cpuCountries.length > 0) {
            const [next, ...rest] = props.cpuCountries;
            setCurrentCpuCountry(next);
            props.setCpuCountries(rest);
            if (rest.length === 0) {
                setLastCpuCard(true);
            } else {
                setLastCpuCard(false);
            }
        } else {
            setCurrentCpuCountry(null);
            setLastCpuCard(false);
        }
    }

    function firstCardPick() {
        if (props.cpuCountries.length === 0 || props.userCountries.length === 0) return;
        const [firstUserCard, ...restUserCards] = props.userCountries;
        const [firstCpuCard, ...restCpuCards] = props.cpuCountries;

        setCurrentUserCountry(firstUserCard);
        setCurrentCpuCountry(firstCpuCard);

        setCpuCardCount(props.gameCardCount);
        setUserCardCount(props.gameCardCount);

        props.setUserCountries(restUserCards);
        props.setCpuCountries(restCpuCards);
    }

    function updateCardCounts(newUserCards: number, newCpuCards: number) {
        setUserCardCount(newUserCards);
        setCpuCardCount(newCpuCards);
    }

    function compareCurrentCards() {
        if (!currentUserCountry || !currentCpuCountry || !selectedAttribute) return;

        const attr = selectedAttribute;
        const userValue = currentUserCountry[attr];
        const cpuValue = currentCpuCountry[attr];

        function triggerGameEnd(winner: "user" | "cpu") {
            props.setGameFinished(true);
            props.setShowWinAnimation(true);
            props.setShowLastCards(true);
            props.setWinner(winner);

            function tempShowWinAnimation() {
                setTimeout(() => {
                    props.setShowWinAnimation(true);
                    props.setGameFinished(true);
                    setTimeout(() => {
                        props.setShowWinAnimation(false);
                    }, 5000);
                }, 1000);
            }

            if (winner === "user") {
                updateCardCounts(props.gameCardCount * 2, 0);
                tempShowWinAnimation();
            } else {
                updateCardCounts(0, props.gameCardCount * 2);
                tempShowWinAnimation()
            }
        }

        const newCards: CountryModel[] = [
            currentUserCountry,
            currentCpuCountry,
            ...tieCountrySave,
        ];

        function handleUserWin() {
            const updated = [...props.userCountries, ...newCards];
            props.setUserCountries(updated);
            updateCardCounts(updated.length, props.cpuCountries.length);
            setTieCountrySave([]);
            setRoundResult("user");
            if (lastCpuCard) triggerGameEnd("user");
        }

        function handleCpuWin() {
            const updated = [...props.cpuCountries, ...newCards];
            props.setCpuCountries(updated);
            updateCardCounts(props.userCountries.length, updated.length);
            props.setLostCardCount(prev => prev + 1);
            setTieCountrySave([]);
            setRoundResult("cpu");
            if (lastUserCard) triggerGameEnd("cpu");
        }

        function handleTie() {
            const updatedTie = [...tieCountrySave, ...newCards];
            setTieCountrySave(updatedTie);
            setRoundResult("tie");
            if (lastCpuCard) triggerGameEnd("user");
            if (lastUserCard) triggerGameEnd("cpu");
        }

        if (typeof userValue === "number" && typeof cpuValue === "number") {
            if (userValue > cpuValue) {
                handleUserWin();
            } else if (userValue < cpuValue) {
                handleCpuWin();
            } else {
                handleTie();
            }
        }

        if (typeof userValue === "string" && typeof cpuValue === "string") {
            let translatedUserValue = userValue;
            let translatedCpuValue = cpuValue;

            if (attr === "capitalCity") {
                translatedUserValue = translatedCapitalCities[currentUserCountry.capitalCity]?.[props.language] ?? currentUserCountry.capitalCity;
                translatedCpuValue = translatedCapitalCities[currentCpuCountry.capitalCity]?.[props.language] ?? currentCpuCountry.capitalCity;
            }

            if (attr === "countryName") {
                translatedUserValue = translatedCountryNames[currentUserCountry.countryName]?.[props.language] ?? currentUserCountry.countryName;
                translatedCpuValue = translatedCountryNames[currentCpuCountry.countryName]?.[props.language] ?? currentCpuCountry.countryName;
            }

            if (translatedUserValue.length > translatedCpuValue.length) {
                handleUserWin();
            } else if (translatedUserValue.length < translatedCpuValue.length) {
                handleCpuWin();
            } else {
                handleTie();
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
        setRoundResult("idle");
    }

    useEffect(() => {
        props.setLostCardCount(0);
        firstCardPick();
        setIsRevealed(false);
        setSelectedAttribute(null);
        setRoundResult("idle");
        setLastUserCard(false);
        setLastCpuCard(false);
        setTieCountrySave([]);
    }, [props.resetSignal]);

    function getTileClass(attribute: string, color: string, side: "user" | "cpu"): string {
        const isSelected = selectedAttribute === attribute;

        return [
            "clickable",
            color,
            isSelected ? "selected-attribute" : "",
            isSelected && isRevealed && roundResult === side ? "winner-border" : "",
            isSelected && isRevealed && roundResult !== side && roundResult !== "tie" ? "loser-border" : "",
            isSelected && isRevealed && roundResult === "tie" ? "tie-border" : ""
        ].filter(Boolean).join(" ");
    }

    return (
        <>
            <div className="space-between">
                <div className="clickable-header no-hover">
                    <p className="header-title no-hover">{translatedGameInfo["Lost Cards"][props.language]}</p>
                    <img src={lostCardsLogo} alt="Lost Card Logo" className="logo-image no-hover" /> :
                    <p className="card-count no-hover"><strong>{props.lostCardCount}</strong></p>
                </div>
                <div className="clickable-header more-width no-hover">
                    <p className="header-title no-hover">{translatedGameInfo["Round Winner"][props.language]}</p>
                    <img src={roundWinner} alt="Lost Card Logo" className="logo-image no-hover" /> :
                    <p className="card-count no-hover"><strong>{translatedGameInfo[roundResult][props.language]}</strong></p>
                </div>
                <div className="clickable-header no-hover">
                    <p className="header-title no-hover">{translatedGameInfo["User Cards"][props.language]}</p>
                    <img src={userLogo} alt="User Logo" className="logo-image no-hover" /> :
                    <p className="card-count no-hover"><strong>{userCardCount}</strong></p>
                </div>
                <div className="clickable-header no-hover">
                    <p className="header-title no-hover">{translatedGameInfo["Cpu Cards"][props.language]}</p>
                    <img src={cpuLogo} alt="Cpu Logo" className="logo-image no-hover" /> :
                    <p className="card-count no-hover"><strong>{cpuCardCount}</strong></p>
                </div>
            </div>

            <div className="space-between">
                <button
                    className={`green-button ${(!selectedAttribute || isRevealed) ? 'button-is-inactive' : ''}`}
                    onClick={handleCheck}
                    disabled={!selectedAttribute || isRevealed}
                >{translatedGameInfo["Check"][props.language]}
                </button>

                <button
                    className={`green-button ${!isRevealed || props.gameFinished ? 'button-is-inactive' : ''}`}
                    onClick={handleNextRound}
                    disabled={!isRevealed || props.gameFinished}
                >{translatedGameInfo["Next Round"][props.language]}
                </button>
            </div>


            <div className="game-board-grid">
                {/* USER-CARDS */}
                <div className="game-cards-container">
                    <div className="flag-tile pastel-flag">
                        {currentUserCountry && (
                            <div className="flag-wrapper">
                                <img
                                    src={userFlagSrc ?? currentUserCountry.imageUrl ?? headerLogo}
                                    alt={`${currentUserCountry.countryName} flag`}
                                    className="image-flag-tile"
                                />
                            </div>
                        )}
                    </div>
                    <div
                        className={getTileClass("countryName", "pastel-mint", "user")}
                        onClick={!isRevealed ? () => setSelectedAttribute("countryName") : undefined}
                    >
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label" >{translatedModelInfo.countryName[props.language]}:</p>
                                <p className="value-line-tile"><strong>{translatedCountryNames[currentUserCountry.countryName]?.[props.language] ?? currentUserCountry.countryName}</strong></p>
                            </h2>
                        )}
                    </div>

                    <div className={getTileClass("capitalCity", "pastel-teal", "user")}
                         onClick={!isRevealed ? () => setSelectedAttribute("capitalCity"): undefined}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label">{translatedModelInfo.capitalCity[props.language]}:</p>
                                <p className="value-line-tile"><strong>{translatedCapitalCities[currentUserCountry.capitalCity]?.[props.language] || currentUserCountry.capitalCity}</strong></p>
                            </h2>
                        )}
                    </div>

                    <div className={getTileClass("populationInMillions", "pastel-purple","user")} onClick={!isRevealed ? () => setSelectedAttribute("populationInMillions") : undefined}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label" >{translatedModelInfo.populationInMillions[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.populationInMillions}</strong> {translatedModelInfo["mio"][props.language]}</p>
                            </h2>
                        )}
                    </div>

                    <div className={getTileClass("populationDensityPerKm2", "pastel-red","user")} onClick={!isRevealed ? () => setSelectedAttribute("populationDensityPerKm2") : undefined}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label" >{translatedModelInfo.populationDensityPerKm2[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.populationDensityPerKm2}</strong> {translatedModelInfo["Density Units"][props.language]}</p>
                            </h2>
                        )}
                    </div>

                    <div className={getTileClass("capitalCityPopulation", "pastel-yellow","user")} onClick={!isRevealed ? () => setSelectedAttribute("capitalCityPopulation") : undefined}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label" >{translatedModelInfo.capitalCityPopulation[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.capitalCityPopulation.toLocaleString("de-DE")}</strong></p>
                            </h2>
                        )}
                    </div>

                    <div className={getTileClass("gdpPerCapitaInUSD", "pastel-orange","user")} onClick={!isRevealed ? () => setSelectedAttribute("gdpPerCapitaInUSD") : undefined}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label">{translatedModelInfo.gdpPerCapitaInUSD[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.gdpPerCapitaInUSD.toLocaleString("de-DE")}</strong> $</p>
                            </h2>
                        )}
                    </div>

                    <div className={getTileClass("forestAreaPercentage", "pastel-green","user")} onClick={!isRevealed ? () => setSelectedAttribute("forestAreaPercentage") : undefined}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label">{translatedModelInfo.forestAreaPercentage[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.forestAreaPercentage}</strong> %</p>
                            </h2>
                        )}
                    </div>

                    <div className={getTileClass("totalAreaInKm2", "pastel-blue","user")} onClick={!isRevealed ? () => setSelectedAttribute("totalAreaInKm2") : undefined}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label">{translatedModelInfo.totalAreaInKm2[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.totalAreaInKm2.toLocaleString("de-DE")}</strong> km²</p>
                            </h2>
                        )}
                    </div>

                    <div className={getTileClass("roadNetworkLengthInKm", "pastel-gray","user")} onClick={!isRevealed ? () => setSelectedAttribute("roadNetworkLengthInKm") : undefined}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label">{translatedModelInfo.roadNetworkLengthInKm[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.roadNetworkLengthInKm.toLocaleString("de-DE")}</strong> km</p>
                            </h2>
                        )}
                    </div>

                    <div className={getTileClass("averageAnnualTemperatureInC", "pastel-brown","user")} onClick={!isRevealed ? () => setSelectedAttribute("averageAnnualTemperatureInC") : undefined}>
                        {currentUserCountry && (
                            <h2 className="text-country-property">
                                <p className="property-label">{translatedModelInfo.averageAnnualTemperatureInC[props.language]}:</p>
                                <p className="value-line-tile"><strong>{currentUserCountry.averageAnnualTemperatureInC}</strong> °C</p>
                            </h2>
                        )}
                    </div>

                    <div className={getTileClass("annualPrecipitationInMm", "pastel-lightblue","user")} onClick={!isRevealed ? () => setSelectedAttribute("annualPrecipitationInMm") : undefined}>
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
                            <div className="revealed-image-container">
                                {currentUserCountry && (
                                        <p ><strong>
                                            <img
                                                src={userFlagSrc ?? currentUserCountry.imageUrl ?? headerLogo}
                                                alt={`${currentUserCountry.countryName} flag`}
                                                className="image-flag-tile-revealed"
                                            />
                                            {translatedCountryNames[currentUserCountry.countryName]?.[props.language] ?? currentUserCountry.countryName}
                                            <img
                                                src={userFlagSrc ?? currentUserCountry.imageUrl ?? headerLogo}
                                                alt={`${currentUserCountry.countryName} flag`}
                                                className="image-flag-tile-revealed"
                                            />
                                        </strong></p>
                                )}
                                <img
                                    src={regionSrc ?? headerLogo ?? undefined}
                                    alt="Verdeckt"
                                    className="cpu-cover-image"
                                />
                            </div>
                    ) : (
                            <div className="game-cards-container-cpu">
                                <div className="flag-tile pastel-flag">
                                    {currentCpuCountry && (
                                        <div className="flag-wrapper">
                                            <img
                                                src={cpuFlagSrc ?? currentCpuCountry.imageUrl ?? headerLogo}
                                                alt={`${currentCpuCountry.countryName} flag`}
                                                className="image-flag-tile"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className={getTileClass("countryName", "pastel-mint","cpu")}>
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

                                <div className={getTileClass("capitalCity", "pastel-teal","cpu")}>
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

                                <div className={getTileClass("populationInMillions", "pastel-purple","cpu")}>
                                    {currentCpuCountry && (
                                        <h2 className="text-country-property">
                                            <p className="property-label">{translatedModelInfo.populationInMillions[props.language]}:</p>
                                            <p className="value-line-tile">
                                                <strong>{currentCpuCountry.populationInMillions}</strong> {translatedModelInfo["mio"][props.language]}
                                            </p>
                                        </h2>
                                    )}
                                </div>

                                <div className={getTileClass("populationDensityPerKm2", "pastel-red","cpu")}>
                                    {currentCpuCountry && (
                                        <h2 className="text-country-property">
                                            <p className="property-label">{translatedModelInfo.populationDensityPerKm2[props.language]}:</p>
                                            <p className="value-line-tile">
                                                <strong>{currentCpuCountry.populationDensityPerKm2}</strong> {translatedModelInfo["Density Units"][props.language]}
                                            </p>
                                        </h2>
                                    )}
                                </div>

                                <div className={getTileClass("capitalCityPopulation", "pastel-yellow","cpu")}>
                                    {currentCpuCountry && (
                                        <h2 className="text-country-property">
                                            <p className="property-label">{translatedModelInfo.capitalCityPopulation[props.language]}:</p>
                                            <p className="value-line-tile">
                                                <strong>{currentCpuCountry.capitalCityPopulation.toLocaleString("de-DE")}</strong>
                                            </p>
                                        </h2>
                                    )}
                                </div>

                                <div className={getTileClass("gdpPerCapitaInUSD", "pastel-orange","cpu")}>
                                    {currentCpuCountry && (
                                        <h2 className="text-country-property">
                                            <p className="property-label">{translatedModelInfo.gdpPerCapitaInUSD[props.language]}:</p>
                                            <p className="value-line-tile">
                                                <strong>{currentCpuCountry.gdpPerCapitaInUSD.toLocaleString("de-DE")}</strong> $
                                            </p>
                                        </h2>
                                    )}
                                </div>

                                <div className={getTileClass("forestAreaPercentage", "pastel-green","cpu")}>
                                    {currentCpuCountry && (
                                        <h2 className="text-country-property">
                                            <p className="property-label">{translatedModelInfo.forestAreaPercentage[props.language]}:</p>
                                            <p className="value-line-tile">
                                                <strong>{currentCpuCountry.forestAreaPercentage}</strong> %
                                            </p>
                                        </h2>
                                    )}
                                </div>

                                <div className={getTileClass("totalAreaInKm2", "pastel-blue","cpu")}>
                                    {currentCpuCountry && (
                                        <h2 className="text-country-property">
                                            <p className="property-label">{translatedModelInfo.totalAreaInKm2[props.language]}:</p>
                                            <p className="value-line-tile">
                                                <strong>{currentCpuCountry.totalAreaInKm2.toLocaleString("de-DE")}</strong> km²
                                            </p>
                                        </h2>
                                    )}
                                </div>

                                <div className={getTileClass("roadNetworkLengthInKm", "pastel-gray","cpu")}>
                                    {currentCpuCountry && (
                                        <h2 className="text-country-property">
                                            <p className="property-label">{translatedModelInfo.roadNetworkLengthInKm[props.language]}:</p>
                                            <p className="value-line-tile">
                                                <strong>{currentCpuCountry.roadNetworkLengthInKm.toLocaleString("de-DE")}</strong> km
                                            </p>
                                        </h2>
                                    )}
                                </div>

                                <div className={getTileClass("averageAnnualTemperatureInC", "pastel-brown","cpu")}>
                                    {currentCpuCountry && (
                                        <h2 className="text-country-property">
                                            <p className="property-label">{translatedModelInfo.averageAnnualTemperatureInC[props.language]}:</p>
                                            <p className="value-line-tile">
                                                <strong>{currentCpuCountry.averageAnnualTemperatureInC}</strong> °C
                                            </p>
                                        </h2>
                                    )}
                                </div>

                                <div className={getTileClass("annualPrecipitationInMm", "pastel-lightblue","cpu")}>
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