import { useState } from 'react'
import Weather from './components/Weather'
import Search from './components/Search'
import Display from './components/Display'
import axios from 'axios'

const api_key = import.meta.env.VITE_WEATHER_KEY


const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [displayCountry, setDisplayCountry] = useState([]);
    const [displayWeather, setDisplayWeather] = useState(null);
    const [previousSearch, setPreviousSearch] = useState('');

    //There is some async bouncing which is causing the rendered state to be funky if multiple operations are done quickly. I just assume that we aren't supposed to deal with that so I won't try to introduce debouncing of any sort.
    const handleSearchChange = (event) => {
        const newSearchTerm = event.target.value;
        
        setSearchTerm(newSearchTerm);

        if (newSearchTerm !== ''){
            axios 
                .get('https://studies.cs.helsinki.fi/restcountries/api/all/')
                .then(response => {
                    const matches = response.data.filter(country => 
                        country.name.common.toLowerCase().includes(newSearchTerm.toLowerCase())
                );
                setDisplayCountry(matches);
                })
                .catch(() => {
                    setDisplayCountry([]);
                })
        } else {
            setDisplayCountry([]);
            setDisplayWeather(null);
        }
    }

    //This is a lazy solution. Better solution would probably be to use the api/name/ + countryName with a near identical copy of Display component, but it would require writing more code instead of reusing the Display component.
    //This solution runs into issues when the name of the country results in two matches, whereas the above solution would work regardless. But since it wasn't required to work perfectly I'll leave it as is.
    const handleButton = (countryName) => {  
        setSearchTerm(countryName);
        axios
            .get('https://studies.cs.helsinki.fi/restcountries/api/all/')
            .then(response => {
                const matches = response.data.filter(country => 
                    country.name.common.toLowerCase().includes(countryName.toLowerCase())
            );
            setDisplayCountry(matches);
            })
            .catch(() => {
                setDisplayCountry([])
            })
    }

    const handleWeather = (capital) => {
        if (displayCountry.length === 1) {
            if (capital[0] !== previousSearch[0]) {
                axios
                    .get('https://api.openweathermap.org/data/2.5/weather?q='+capital+'&appid='+api_key+'&units=metric')
                    .then(response => {
                        console.log(response.data)
                        setDisplayWeather(response.data)
                        setPreviousSearch(capital);
                    })
                    .catch(() => {
                        setDisplayWeather(null)
                    })
            }
        } else if (displayCountry.length > 1 || displayCountry.length === 0) { //Hides previous weather data when useEffect is triggered if theres no countries or more than 1
            setDisplayWeather(null)
            setPreviousSearch('')
        }
    }

    return (
        <div>
        <Search searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
        <Display countryNames={displayCountry} handleButton={handleButton} handleWeather={handleWeather} />
        <Weather speed={displayWeather?.wind?.speed} temp={displayWeather?.main?.temp} clouds={displayWeather?.weather?.[0]?.icon}/>
        </div>
    )
}

export default App
