const Weather = ({ speed, temp, clouds }) => {
    if (speed === undefined || temp === undefined || clouds === undefined || speed === null || temp === null || clouds === null) {
        return <p></p>
    }
    return (
        <div>
        <p> temperature {temp} Celcius</p>
        <img src={'http://openweathermap.org/img/wn/' +clouds+ '@2x.png'} />
        <p>wind {speed} m/s</p>
        </div>
    )
}

export default  Weather;
