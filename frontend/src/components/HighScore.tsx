import type {HighScoreModel} from "./model/HighScoreModel.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import "./styles/HighScore.css"

type HighScoreProps = {
    highScores: { [key: number]: HighScoreModel[] };
    getHighScores: (count: number) => void;
}

const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };
    return new Date(date).toLocaleDateString("de-DE", options);
};

export default function HighScore(props:Readonly<HighScoreProps>) {
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [githubUsernames, setGithubUsernames] = useState<Map<string, string>>(new Map());

    function fetchGithubUsernames(highScores: HighScoreModel[]) {
        const uniqueIds = new Set(
            highScores
                .filter(score => score.githubId !== "anonymousUser")
                .map(score => score.githubId)
        );

        const newUsernames = new Map(githubUsernames);

        uniqueIds.forEach(async (id) => {
            if (!newUsernames.has(id)) {
                axios.get(`https://api.github.com/user/${id}`)
                    .then((response) => {
                        newUsernames.set(id, response.data.login);
                        setGithubUsernames(new Map(newUsernames));
                    })
                    .catch((error) => {
                        console.error(`Error fetching GitHub user ${id}:`, error);
                    });
            }
        });
    }

    useEffect(() => {
        const allHighScores = Object.values(props.highScores).flat();
        fetchGithubUsernames(allHighScores);
    }, [props.highScores]);

    useEffect(() => {
        [5, 10, 25].forEach(props.getHighScores);
    }, []);

    const handleTableSelect = (tableId: string) => {
        setSelectedTable(tableId);
    };

    const handleBack = () => {
        setSelectedTable(null);
    };

    const renderCompressedTable = (highScores: HighScoreModel[], cardType: string) => (
        <div className="high-score-table-compressed" onClick={() => handleTableSelect(cardType)}>
            <h3 className="high-score-table-compressed-h3">{cardType} Cards</h3>
            <table>
                <thead>
                <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Lost Cards</th>
                </tr>
                </thead>
                <tbody>
                {highScores.map((highScore, index) => (
                    <tr key={highScore.id}>
                        <td>{index + 1}</td>
                        <td>{highScore.playerName}</td>
                        <td>{highScore.lostCardCount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

    const renderDetailedTable = (highScores: HighScoreModel[], cardType: string, isSelected: boolean) => {
        if (!isSelected) return null;

        return (
            <div className="high-score-table">
                <h3 className="high-score-table-h3">{cardType} Cards</h3>
                <table>
                    <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player-Name</th>
                        <th>Date</th>
                        <th>Card Count</th>
                        <th>Lost Cards</th>
                        <th>Authentication</th>
                        <th>Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {highScores.map((highScore, index) => (
                        <tr key={highScore.id}>
                            <td>{index + 1}</td>
                            <td>{highScore.playerName}</td>
                            <td>{formatDate(highScore.date)}</td>
                            <td>{highScore.cardCount}</td>
                            <td>{highScore.lostCardCount}</td>
                            <td>
                                {highScore.githubId === "anonymousUser"
                                    ? "Anonymous"
                                    : `Github-User (${githubUsernames.get(highScore.githubId) || "Loading..."})`}
                            </td>
                            <td>{highScore.scoreTime}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="high-score">
            <div
                className={selectedTable === null ? 'high-score-item-container-compressed' : 'high-score-item-container-detailed'}>
                {selectedTable === null ? (
                    <>
                        {renderCompressedTable(props.highScores[5], "5")}
                        {renderCompressedTable(props.highScores[10], "10")}
                        {renderCompressedTable(props.highScores[25], "25")}
                    </>
                ) : (
                    <>
                        {selectedTable === "5" && renderDetailedTable(props.highScores[5], "5", true)}
                            {selectedTable === "10" && renderDetailedTable(props.highScores[10], "10", true)}
                            {selectedTable === "25" && renderDetailedTable(props.highScores[25], "25", true)}
                    </>
                )}
            </div>
            {selectedTable !== null && (
                <button onClick={handleBack} className="button-group-button">Back to Overview</button>
            )}
        </div>
    );
}