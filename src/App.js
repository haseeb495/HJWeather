import { useState } from "react";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { getWeatherByCity } from "./utils/weatherApi";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  //   console.log("Weather Data:", weatherData);
  const bgImage = {
    backgroundImage: "url('/BGimage.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    borderRadius: "12px",
    minHeight: "100vh",
  };
  useEffect(() => {
    async function fetchDefaultCity() {
      const defaultWeather = await getWeatherByCity("Islamabad");
      setWeatherData(defaultWeather);
    }
    fetchDefaultCity();
  }, []);

  return (
    <div className="app-container" style={bgImage}>
      <Header />
      <main>
        <Searchbar onWeatherFetched={setWeatherData} />
        <Temperature weatherData={weatherData} />
        <Cityname weatherData={weatherData} />
        <Map weatherData={weatherData} />

        <WeatherDetails weatherData={weatherData} />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return <header className="header">HJWeather</header>;
}

function Searchbar({ onWeatherFetched }) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    if (!search.trim()) return;
    setLoading(true);
    setError("");

    try {
      const fetchedWeather = await getWeatherByCity(search);
      onWeatherFetched(fetchedWeather); // Now using a clearly named local variable
    } catch (err) {
      setError("City not found.");
    }

    setLoading(false);
  }

  return (
    <div className="searchbar-container">
      <input
        className="searchbar"
        type="text"
        placeholder="Search for a city..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button className="search-button" onClick={handleSearch}>
        {loading ? "Loading..." : "Search"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

function Temperature({ weatherData }) {
  if (!weatherData || !weatherData.main) return null;

  return (
    <div className="temperature-display">
      <h2>{weatherData.main.temp}°C ☀️</h2>
    </div>
  );
}

function Cityname({ weatherData }) {
  if (!weatherData) return null;

  return (
    <div className="city-display">
      <h2>{weatherData.name} 🏙️</h2>
    </div>
  );
}

function Map({ weatherData }) {
  function RecenterMap({ lat, lon }) {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lon]);
    }, [lat, lon, map]);
    return null;
  }

  console.log("Map received weatherData:", weatherData);

  // Only render the map if we have coordinates
  if (
    !weatherData ||
    !weatherData.coord ||
    weatherData.coord.lat === undefined ||
    weatherData.coord.lon === undefined
  ) {
    return <div className="map-container">Map will appear here.</div>;
  }

  const { lat, lon } = weatherData.coord;

  return (
    <div
      className="map-container"
      style={{ height: "250px", width: "100%", marginBottom: "1rem" }}
    >
      <MapContainer
        center={[lat, lon]}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <RecenterMap lat={lat} lon={lon} />
        <Marker position={[lat, lon]}>
          <Popup>{weatherData.name}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

function WeatherDetails({ weatherData }) {
  if (
    !weatherData ||
    !weatherData.weather ||
    !weatherData.weather[0] ||
    !weatherData.main ||
    !weatherData.wind
  )
    return null;

  const description = weatherData.weather[0].description;
  const humidity = weatherData.main.humidity;
  const wind = weatherData.wind.speed;

  return (
    <div className="weather-details">
      <p>
        <span style={{ fontWeight: "bold" }}>Condition:</span> {description}{" "}
      </p>
      <p>
        <span style={{ fontWeight: "bold" }}>Humidity: </span>
        {humidity}% 💧
      </p>
      <p>
        <span style={{ fontWeight: "bold" }}> Wind Speed:</span> {wind} m/s ༄🍂
      </p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      &copy; {new Date().getFullYear()} Created by HJ. All rights reserved.
    </footer>
  );
}
