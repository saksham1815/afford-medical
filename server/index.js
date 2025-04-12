const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;
const API_KEY = process.env.API_KEY;

app.use(cors());
app.use(express.json());

app.post("/weather", async (req, res) => {
  try {
    const { location, lat, lon } = req.body;
    let weatherUrl, forecastUrl;

    if (location) {
      weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`;
      forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`;
    } else if (lat && lon) {
      weatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    } else {
      return res.status(400).json({ error: "Location required" });
    }

    const [weatherRes, forecastRes] = await Promise.all([
      axios.get(weatherUrl),
      axios.get(forecastUrl),
    ]);

    res.json({
      current: weatherRes.data,
      forecast: forecastRes.data,
    });
  } catch (err) {
    console.error("Error fetching weather:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
