import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
    const [value, setValue] = useState('')

    const onChange = (event) => {
        setValue(event.target.value)
    }

    return {
        type,
        value,
        onChange
    }
}

const useCountry = (name) => {
    const [country, setCountry] = useState(null)

    useEffect(() => {
        if (name === '') {
            setCountry(null)
            return
        }

        const fetch = (name) => {
            axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name.toLowerCase()}`)
                .then(response => {
                    setCountry({ found: true, data: response.data })
                })
                .catch(() => {
                    setCountry({ found: false })
                })
        }

        fetch(name)
    }, [name])

    return country
}

const Country = ({ country }) => {
    if (!country) {
        return null
    }

    if (!country.found) {
        return (
            <div>
                not found...
            </div>
        )
    }

    return (
        //I hope that this is the intended way to solve this instead of mapping parts of response.data under data.name, data.capital, data.population & data.flag by hand in the useEffect block to ensure that *NOTHING* but useCountry is modified.
        //This seems a lot more reasonable to me compared to manually mapping the entire data field of the response. If there is a way to do that automagically, it either wasn't clear enough on the material or its introduction would be well appreciated.
        <div>
            <h3>{country.data.name.common} </h3>
            <div>capital {country.data.capital[0]} </div>
            <div>population {country.data.population}</div>
            <img src={country.data.flags.png} height='100' alt={`flag of ${country.data.name.common}`} />
        </div>
    )
}

const App = () => {
    const nameInput = useField('text')
    const [name, setName] = useState('')
    const country = useCountry(name)

    const fetch = (e) => {
        e.preventDefault()
        setName(nameInput.value)
    }

    return (
        <div>
            <form onSubmit={fetch}>
                <input {...nameInput} />
                <button>find</button>
            </form>

            <Country country={country} />
        </div>
    )
}

export default App
