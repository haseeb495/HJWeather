const API_KEY = "9b56fddbefea3f2254e37761b65eeb77";

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
