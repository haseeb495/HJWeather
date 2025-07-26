const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

export async function getWeatherByCity(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch weather data.");
  }

  const data = await response.json();
  return data;
}
