import type {HighScoreModel} from "./model/HighScoreModel.ts";
import {useEffect, useState} from "react";
import type {CountryModel} from "./model/CountryModel.ts";
import Preview from "./Preview.tsx";
import Game from "./Game.tsx";
import axios from "axios";

type PlayProps = {
    user: string;
    highScores: { [key: number]: HighScoreModel[] };
    getHighScores: (count: number) => void;
}

export default function Play(props: Readonly<PlayProps>) {
    const [showPreviewMode, setShowPreviewMode] = useState<boolean>(true);
    const [gameFinished, setGameFinished] = useState<boolean>(true);
    const [intervalId, setIntervalId] = useState<number | null>(null);
    const [gameCardCount,setGameCardCount] = useState<number>(5);
    const [userCountries, setUserCountries] = useState<CountryModel[]>([]);
    const [cpuCountries, setCpuCountries] = useState<CountryModel[]>([]);

    const [lostCardCount, setLostCardCount] = useState<number>(0);
    const [remainingPlayerCards, setRemainingPlayerCards] = useState<number>(5);
    const [remainingCpuCards, setRemainingCpuCards] = useState<number>(5);

    const [showWinAnimation, setShowWinAnimation] = useState<boolean>(false);
    const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
    const [playerName, setPlayerName] = useState<string>("");
    const [time, setTime] = useState<number>(0);
    const [showNameInput, setShowNameInput] = useState<boolean>(false);

    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [resetSignal, setResetSignal] = useState<number>(0);


    useEffect(() => {
        if (!showPreviewMode && !gameFinished) {
            setTime(0);
            const id = window.setInterval(() => {
                setTime((prev) => prev + 0.1);
            }, 100);
            setIntervalId(id);
        } else if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    }, [showPreviewMode, gameFinished]);

    function getUserAndCpuCards(count: number) {
        axios.get(`/api/world-quartet-hub/deal/${count}`)
            .then((response) => {
                setUserCountries(response.data.user as CountryModel[]);
                setCpuCountries(response.data.cpu as CountryModel[]);
            })
            .catch((error) => {
                console.error(`Error fetching cards for count ${count}:`, error);
            });
    }

    function handleGameStart() {
        setLostCardCount(0);
        setRemainingPlayerCards(gameCardCount);
        setRemainingCpuCards(gameCardCount);
        getUserAndCpuCards(gameCardCount);

        setShowPreviewMode(false);
        setGameFinished(false);
        setShowWinAnimation(false);
        setIsNewHighScore(false);
        setTime(0);
        setShowNameInput(false);
        setResetSignal(prev => prev + 1);
    }

    function handleHardResetGame() {
        setShowPreviewMode(true);
        setGameFinished(true);
        setIsNewHighScore(false);
    }

    return(
        <>
            <div className="space-between">
                <button className="button-group-button" onClick={handleGameStart}>Start Game</button>
                <button className="button-group-button" onClick={handleHardResetGame}>Reset Game</button>
            </div>

            {!showPreviewMode &&
                <div className="space-between">
                    <p>Lost Card Count {lostCardCount}</p>
                    <p>remainingPlayerCards {remainingPlayerCards}</p>
                    <p>remainingCpuCards {remainingCpuCards}</p>
                    {/*<p>⏱️ Time: {time.toFixed(1)} sec</p>*/}
                </div>
            }

            {showPreviewMode &&
                <>
                    <div>
                        <h4>Choose Number of Cards:</h4>
                        <div className="space-between">
                            <div
                                className={`clickable-header ${gameCardCount === 5 ? "active-button-deck-difficulty" : ""}`}
                                onClick={()=> setGameCardCount(5)}>
                                <h2 className="header-title">5</h2>
                            </div>
                            <div
                                className={`clickable-header ${gameCardCount === 10 ? "active-button-deck-difficulty" : ""}`}
                                onClick={()=> setGameCardCount(10)}>
                                <h2 className="header-title">10</h2>
                            </div>
                            <div
                                className={`clickable-header ${gameCardCount === 25 ? "active-button-deck-difficulty" : ""}`}
                                onClick={()=> setGameCardCount(25)}>
                                <h2 className="header-title">25</h2>
                            </div>

                        </div>
                    </div>


                    <Preview/>
                    <Game userCountries={userCountries} setUserCountries={setUserCountries} cpuCountries={cpuCountries} setCpuCountries={setCpuCountries} setGameFinished={setGameFinished} setLostCardCount={setLostCardCount} setShowWinAnimation={setShowWinAnimation} resetSignal={resetSignal}/>
                </>}


        </>
    )
}