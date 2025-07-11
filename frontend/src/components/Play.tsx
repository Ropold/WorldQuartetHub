import type {HighScoreModel} from "./model/HighScoreModel.ts";
import {useEffect, useState} from "react";
import type {CountryModel} from "./model/CountryModel.ts";
import GameExplanation from "./GameExplanation.tsx";
import Game from "./Game.tsx";
import axios from "axios";
import {translatedGameInfo} from "./utils/TranslatedGameInfo.ts";
import "./styles/Play.css"

type PlayProps = {
    user: string;
    highScores: { [key: number]: HighScoreModel[] };
    getHighScores: (count: number) => void;
    language: string;
}

export default function Play(props: Readonly<PlayProps>) {
    const [showPreviewMode, setShowPreviewMode] = useState<boolean>(true);
    const [gameFinished, setGameFinished] = useState<boolean>(true);
    const [intervalId, setIntervalId] = useState<number | null>(null);
    const [gameCardCount,setGameCardCount] = useState<number>(5);
    const [userCountries, setUserCountries] = useState<CountryModel[]>([]);
    const [cpuCountries, setCpuCountries] = useState<CountryModel[]>([]);
    const [lostCardCount, setLostCardCount] = useState<number>(0);

    const [showLastCards, setShowLastCards] = useState<boolean>(false);
    const [winner, setWinner] = useState<"user" | "cpu" | "">("");
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

    async function getUserAndCpuCards(count: number) {
        try {
            const response = await axios.get(`/api/world-quartet-hub/deal/${count}`);
            setUserCountries(response.data.user as CountryModel[]);
            setCpuCountries(response.data.cpu as CountryModel[]);
        } catch (error) {
            console.error(`Error fetching cards for count ${count}:`, error);
        }
    }

    function postHighScore() {
        const highScoreData = {
            id: null,
            playerName: playerName,
            githubId: props.user,
            cardCount: gameCardCount,
            lostCardCount: lostCardCount,
            scoreTime: parseFloat(time.toFixed(1)),
            date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
        };

        axios.post("/api/high-score", highScoreData)
            .then(() => {
                setShowNameInput(false);
            })
            .catch(console.error);
    }

    useEffect(() => {
        if (gameFinished && winner === "user") {
            checkForHighScore();
        }
    }, [gameFinished]);

    function checkForHighScore() {
        const currentHighScores = props.highScores[gameCardCount];

        if (!currentHighScores) return;

        if (currentHighScores.length < 10) {
            setIsNewHighScore(true);
            setShowNameInput(true);
            return;
        }

        const worstScore = currentHighScores[currentHighScores.length - 1];
        const isBetter =
            lostCardCount < worstScore.lostCardCount ||
            (lostCardCount === worstScore.lostCardCount && time < worstScore.scoreTime);

        if (isBetter) {
            setIsNewHighScore(true);
            setShowNameInput(true);
        }
    }

    function handleSaveHighScore() {
        if (playerName.trim().length < 3) {
            setPopupMessage("Your name must be at least 3 characters long!");
            setShowPopup(true);
            return;
        }
        postHighScore();
    }

    async function handleGameStart() {
        await getUserAndCpuCards(gameCardCount);
        setWinner("");
        setPlayerName("");
        setLostCardCount(0);
        setShowPreviewMode(false);
        setGameFinished(false);
        setShowWinAnimation(false);
        setIsNewHighScore(false);
        setShowLastCards(false)
        setTime(0);
        setShowNameInput(false);
        setResetSignal(prev => prev + 1);
    }

    function handleHardResetGame() {
        setWinner("");
        setPlayerName("");
        setShowPreviewMode(true);
        setGameFinished(true);
        setIsNewHighScore(false);
        setWinner("");
        setLostCardCount(0);
        setTime(0);
        setShowWinAnimation(false);
    }

    function handleCancelHighScore() {
        setShowNameInput(false);
        setIsNewHighScore(false);
        setPlayerName("");
    }

    const getWinClass = () => {
        if (winner === "cpu") return "win-animation win-animation-bad";
        if (lostCardCount === 0) return "win-animation win-animation-perfect";
        if (lostCardCount <= 3) return "win-animation win-animation-good";
        return "win-animation win-animation-ok";
    };

    return(
        <>
            <div className="space-between">
                <button className={`green-button ${!gameFinished ? 'button-is-inactive' : ''}`}
                        onClick={handleGameStart}
                        disabled={!gameFinished}
                >{translatedGameInfo["Start Game"][props.language]}</button>
                <button className="purple-button" onClick={handleHardResetGame}>{translatedGameInfo["Reset Game"][props.language]}</button>
            </div>

            {isNewHighScore && showNameInput && (
                <form
                    className="high-score-input"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveHighScore();
                    }}
                >
                    <label htmlFor="playerName">
                        {translatedGameInfo["Congratulations! You secured a spot on the high score list. Enter your name:"][props.language]}
                    </label>
                    <input
                        className="playerName"
                        type="text"
                        id="playerName"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder={translatedGameInfo["Enter your name"][props.language]}
                    />
                    <div>
                    <button
                        className="button-group-button"
                        id="button-border-animation"
                        type="submit"
                    >
                        {translatedGameInfo["Save High Score"][props.language]}
                    </button>
                    <button className="button-group-button margin-left-10" onClick={handleCancelHighScore}>{translatedGameInfo["Cancel"][props.language]}</button>
                    </div>
                </form>
            )}

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Note</h3>
                        <p>{popupMessage}</p>
                        <div className="popup-actions">
                            <button onClick={() => setShowPopup(false)} className="popup-confirm">
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showWinAnimation && (
                <div className={getWinClass()}>
                    <p>
                        {winner === "user" ? (
                            <>
                                {translatedGameInfo["You beat the Cpu!"][props.language]}
                                {lostCardCount === 0
                                    ? ` ${translatedGameInfo["with a flawless game"][props.language]}`
                                    : lostCardCount <= 3
                                        ? ` ${translatedGameInfo["and only gave away"][props.language]} ${lostCardCount} ${translatedGameInfo[lostCardCount === 1 ? "card" : "cards"][props.language]}. ${translatedGameInfo["Impressive!"][props.language]}`
                                        : ` ${translatedGameInfo["and had to give up"][props.language]} ${lostCardCount} ${translatedGameInfo["cards"][props.language]}. ${translatedGameInfo["Well played!"][props.language]}`}
                            </>
                        ) : winner === "cpu" ? (
                            <>
                                {translatedGameInfo["The CPU wins! The CPU took all your cards. Time for a rematch!"][props.language]}
                            </>
                        ) : null}
                    </p>
                </div>
            )}

            {showPreviewMode &&
                <>
                    <div>
                        <h4>{translatedGameInfo["Choose Number of Cards"][props.language]}:</h4>
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


                    <GameExplanation language={props.language}/>
                </>}

            {!showPreviewMode && (!gameFinished || showLastCards) && (
                <Game
                    userCountries={userCountries}
                    setUserCountries={setUserCountries}
                    cpuCountries={cpuCountries}
                    setCpuCountries={setCpuCountries}
                    gameFinished={gameFinished}
                    setGameFinished={setGameFinished}
                    lostCardCount={lostCardCount}
                    setLostCardCount={setLostCardCount}
                    setShowWinAnimation={setShowWinAnimation}
                    resetSignal={resetSignal}
                    gameCardCount={gameCardCount}
                    language={props.language}
                    winner={winner}
                    setWinner={setWinner}
                    setShowLastCards={setShowLastCards}
                />
            )}
        </>
    )
}