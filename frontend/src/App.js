import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");

  const getWeather = async () => {
    try {
      const res = await axios.post("http://localhost:5000/weather", {
        location,
      });
      setWeather(res.data.current);
      setForecast(res.data.forecast);
      setError("");
    } catch (err) {
      setError("❌ Unable to retrieve weather data.");
    }
  };

  const getLocationWeather = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await axios.post("http://localhost:5000/weather", {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setWeather(res.data.current);
        setForecast(res.data.forecast);
        setError("");
      } catch {
        setError("❌ Unable to retrieve weather data.");
      }
    });
  };

  return (
    <div className="container">
      <h1>🌦️ Weather App</h1>
      <p>by Saksham Saxena</p>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter city, zip, etc."
      />
      <br />
      <button onClick={getWeather}>Get Weather</button>
      <button onClick={getLocationWeather}>Use My Location</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div>
          <h2>{weather.name}</h2>
          <p>
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              alt=""
            />{" "}
            {weather.weather[0].description}
          </p>
          <p>🌡️ Temp: {weather.main.temp}°C</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>🌬️ Wind: {weather.wind.speed} m/s</p>
        </div>
      )}

      {forecast && (
        <>
          <h3>5-Day Forecast</h3>
          <div className="forecast">
            {forecast.list
              .filter((_, i) => i % 8 === 0)
              .map((f, i) => (
                <div key={i} className="forecast-card">
                  <p>{new Date(f.dt_txt).toDateString()}</p>
                  <img
                    src={`http://openweathermap.org/img/wn/${f.weather[0].icon}.png`}
                    alt=""
                  />
                  <p>{f.main.temp}°C</p>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
