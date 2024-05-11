const SingleWeatherReport = ({ weather, unit }) => {
    const isCitySearch = weather?.name;

    const convertTemperature = (temp) => {
        if (unit === 'metric') {
            return `${temp.toFixed(2)} °C`;
        } else {
            const fahrenheitTemp = (temp * 9 / 5) + 32;
            return `${fahrenheitTemp.toFixed(2)} °F`;
        }
    };

    return (
        <>
            <div className="main-container-box">
                <div className="single-modal-weather-box">
                    <h4>City Name: {isCitySearch ? weather.name : weather.city?.name}</h4>
                    {isCitySearch ? null : (
                        <>
                            <p>Sunrise : {new Date(weather.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                            <p>Sunset : {new Date(weather.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                            <p>Timezone : {new Date(weather.timezone * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                        </>
                    )}
                    {weather.main && (
                        <>
                            <p>Temperature: {convertTemperature(weather.main.temp)}</p>
                            <p>Feels Like: {convertTemperature(weather.main.feels_like)}</p>
                            <p>Min Temperature: {convertTemperature(weather.main.temp_min)}</p>
                            <p>Max Temperature: {convertTemperature(weather.main.temp_max)}</p>
                            <p>Pressure: {weather.main.pressure}</p>
                            <p>Humidity: {weather.main.humidity}%</p>
                        </>
                    )}
                    <p>Wind Speed: {weather.wind ? weather.wind.speed : 'N/A'} m/s</p>
                </div>
            </div>
        </>
    );
};

export default SingleWeatherReport;
