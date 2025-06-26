import type {CountryModel} from "./model/CountryModel.ts";
import * as React from "react";

type GameProps = {
    userCountries: CountryModel[];
    setUserCountries: React.Dispatch<React.SetStateAction<CountryModel[]>>
    cpuCountries: CountryModel[];
    setCpuCountries: React.Dispatch<React.SetStateAction<CountryModel[]>>;
    setGameFinished: React.Dispatch<React.SetStateAction<boolean>>;
    setLostCardCount: React.Dispatch<React.SetStateAction<number>>;
    setShowWinAnimation: React.Dispatch<React.SetStateAction<boolean>>;
    resetSignal:number;
}

export default function Game(props: Readonly<GameProps>) {
    return(
        <h2>Game</h2>
    )
}