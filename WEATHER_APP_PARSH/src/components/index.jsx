// WeatherReport.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import SingleWeatherReport from "./singleWeather";
import "./index.css";

const WeatherReport = () => {
    const [city, setCity] = useState('');
    const [weatherArr, setWeatherArr] = useState(null);
    const [loader, setLoader] = useState(false);
    const [unit, setUnit] = useState('metric'); // 'metric' for Celsius, 'imperial' for Fahrenheit
    const [nodata, setNoData] = useState(false);
    const [history, setHistory] = useState([]);

    const API_KEY = "a4f103909d3eda932cbadd07a8602236";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`;
    const gifLoader = "https://img.pikbest.com/png-images/20190918/cartoon-snail-loading-loading-gif-animation_2734139.png!bw700";

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('weatherHistory'));
        if (savedHistory) {
            setHistory(savedHistory);
        }
    }, []);

    const fetchWeather = () => {
        setLoader(true);
        axios.get(url)
            .then((res) => {
                setLoader(false);
                setNoData(false);
                setWeatherArr(res?.data);
                addToHistory(city);
            })
            .catch((error) => {
                setNoData(true);
                setLoader(false);
                console.error("Error fetching weather data:", error);
            });
    };

    const addToHistory = (cityName) => {
        const updatedHistory = [...history, cityName];
        setHistory(updatedHistory);
        localStorage.setItem('weatherHistory', JSON.stringify(updatedHistory));
    };

    const handleUnitChange = () => {
        const newUnit = unit === 'metric' ? 'imperial' : 'metric';
        setUnit(newUnit);
        fetchWeather();
    };

    const fetchWeatherByGeolocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const response = await axios.get(
                            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${unit}`
                        );
                        if (response.status === 200) {
                            setWeatherArr(response.data);
                            addToHistory(response.data.name);
                        } else {
                            throw new Error('Failed to fetch weather data');
                        }
                    } catch (error) {
                        console.error('Error fetching weather:', error.message);
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error.message);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    return (
        <>
            <div>
                <input
                    type="text"
                    className="input-field"
                    placeholder="Enter City"
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
                />
                    <button className="btn-search" onClick={fetchWeather}>Search</button>
                    <button className="btn-geolocation" onClick={fetchWeatherByGeolocation}>Use My Location</button>
                    <button className="btn-search" onClick={handleUnitChange}>
                        {unit === 'metric' ? '°C' : '°F'}
                    </button>

                {nodata ? (
                    <div className="no-data-box">
                        <p className="no-data-text">Invalid City Name</p>
                    </div>
                ) : (
                    <div>
                        {loader ? (
                            <div className="img-loader-box">
                                <img className="img-loader" src={gifLoader} alt="Loading..." />
                            </div>
                        ) : (
                            <div>
                                {weatherArr && <SingleWeatherReport weather={weatherArr} unit={unit} />}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="history-container">
                <h2>Search History</h2>
                <ul>
                    {history.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default WeatherReport;
