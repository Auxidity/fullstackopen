import { useEffect } from 'react';

const Display = ({ countryNames, handleButton, handleWeather }) => {
    useEffect(() => {
        if (countryNames.length === 1) {
            handleWeather(countryNames[0].capital);
        } else {
            handleWeather('');
        }
    }, [countryNames, handleWeather]);

    return (
        <div>
            {countryNames.length === 1 ? (
                <div>
                    <h2>{countryNames[0].name.common}</h2>
                    <p>capital {countryNames[0].capital}</p>
                    <p>area {countryNames[0].area}</p>

                    <h3>languages:</h3>
                    <ul>
                        { Object.values(countryNames[0].languages).map((languages, index) => (
                                <li key={index}>{languages}</li>
                        ))}
                    </ul>
                    <img src={countryNames[0].flags.png} />

                    <h3>Weather in {countryNames[0].capital}</h3>

                </div>
            ) :countryNames.length > 0 && countryNames.length < 10 ? (
                <ul>
                    {countryNames.map((country, index) => (
                        <li key={index}>{country.name.common}
                        <button onClick = {() => handleButton(country.name.common)}>show</button> 
                        </li>
                    ))}
                </ul>
            ) : countryNames.length === 0 ? (
                <p>No matches</p>
            ) : (
                <p>Too many matches</p>
            )}
        </div>
    );
};

export default Display;
