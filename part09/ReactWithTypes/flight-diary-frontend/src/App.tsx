enum Weather {
    Sunny = "sunny",
    Rainy = "rainy",
    Cloudy = "cloudy",
    Stormy = "stormy",
    Windy = "windy",
}

enum Visibility {
    Great = "great",
    Good = "good",
    Ok = "ok",
    Poor = "poor",
}

interface DiaryEntry {
    id: number;
    date: string;
    weather: Weather;
    visibility: Visibility;
    comment?: string;
}

import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
    const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

    const [newDiaryDate, setNewDiaryDate] = useState("");

    //The following two are set with defaults to prevent funky situations from occuring.
    const [selectedWeather, setSelectedWeather] = useState<Weather>(
        Weather.Sunny,
    );
    const [selectedVisibility, setSelectedVisibility] = useState<Visibility>(
        Visibility.Great,
    );
    const [newDiaryComment, setNewDiaryComment] = useState("");
    const [error, setError] = useState(undefined);

    useEffect(() => {
        axios
            .get<DiaryEntry[]>("http://localhost:3000/api/diaries")
            .then((response) => {
                console.log(response.data);
                setDiaries(response.data);
            });
    }, []);

    const diaryCreation = (event: React.SyntheticEvent) => {
        event.preventDefault();

        axios
            .post<DiaryEntry>("http://localhost:3000/api/diaries", {
                weather: selectedWeather,
                visibility: selectedVisibility,
                date: newDiaryDate,
                comment: newDiaryComment,
            })
            .then((response) => {
                setDiaries(diaries.concat(response.data));
            })
            .catch((error) => {
                setError(error.response.data);
                setTimeout(() => {
                    setError(undefined);
                }, 5000);
            });

        setNewDiaryDate("");
        setNewDiaryComment("");
        setSelectedWeather(Weather.Sunny);
        setSelectedVisibility(Visibility.Great);
    };

    const ErrorComponent = () => {
        if (error === null || error === undefined || error === "") {
            return null;
        } else {
            return <div>{error}</div>;
        }
    };

    return (
        <div>
            <ErrorComponent />
            <h2>Add new entry</h2>
            <form onSubmit={diaryCreation}>
                <div>
                    date
                    <input
                        type="date"
                        value={newDiaryDate}
                        onChange={(event) => setNewDiaryDate(event.target.value)}
                    />
                </div>
                <div>
                    <label>Weather:</label>
                    {Object.values(Weather).map((weatherOption) => (
                        <label key={weatherOption}>
                            <input
                                type="radio"
                                name="weather"
                                value={weatherOption}
                                checked={selectedWeather === weatherOption}
                                onChange={(e) => setSelectedWeather(e.target.value as Weather)}
                            />
                            {weatherOption}
                        </label>
                    ))}
                </div>
                <div>
                    <label>Visibility:</label>
                    {Object.values(Visibility).map((visibilityOption) => (
                        <label key={visibilityOption}>
                            <input
                                type="radio"
                                name="visibility"
                                value={visibilityOption}
                                checked={selectedVisibility === visibilityOption}
                                onChange={(e) =>
                                    setSelectedVisibility(e.target.value as Visibility)
                                }
                            />
                            {visibilityOption}
                        </label>
                    ))}
                </div>
                <div>
                    comment
                    <input
                        value={newDiaryComment}
                        onChange={(event) => setNewDiaryComment(event.target.value)}
                    />
                </div>
                <button type="submit">add</button>
            </form>
            <h2>Diary entries</h2>
            <ul>
                {diaries.map((diary) => (
                    <li key={diary.id}>
                        <h3>{diary.date}</h3>
                        <div>visibility:{diary.visibility}</div>
                        <div>weather:{diary.weather}</div>
                        <div>{diary.comment && <p>{diary.comment}</p>}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
