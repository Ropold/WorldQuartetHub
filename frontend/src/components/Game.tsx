import type {CountryModel} from "./model/CountryModel.ts";
import * as React from "react";
import {useState} from "react";

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
}

export default function Game(props: Readonly<GameProps>) {

    const [remainingPlayerCards, setRemainingPlayerCards] = useState<number>(5);
    const [remainingCpuCards, setRemainingCpuCards] = useState<number>(5);

    const [currentUserCountry, setCurrentUserCountry] = useState<CountryModel | null>(null);
    const [currentCpuCountry, setCurrentCpuCountry] = useState<CountryModel | null>(null);

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

    return(
        <>
            <h2>Game</h2>

                <div className="space-between">
                    <p>Lost Card Count {props.lostCardCount}</p>
                    <p>remainingPlayerCards {remainingPlayerCards}</p>
                    <p>remainingCpuCards {remainingCpuCards}</p>
                    {/*<p>⏱️ Time: {time.toFixed(1)} sec</p>*/}
                </div>

        </>
    )
}