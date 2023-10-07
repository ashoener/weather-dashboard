/** @type {import("alpinejs/index.d.ts").Alpine} */
var Alpine = window.Alpine;

const apiKey = "e229231d710a9cebff255e2b499ccac6";
let coordinateCache = JSON.parse(localStorage.getItem("coordinateCache")) || {};

document.addEventListener("alpine:init", () => {
  let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
  Alpine.store("data", { recentCities, currentCity: "", weatherData: {} });
});

async function getLatLong(location) {
  if (location in coordinateCache) return coordinateCache[location];
  const coords = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      location
    )}&limit=1&appid=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) =>
      data.length ? { lat: data[0].lat, lon: data[0].lon } : false
    );
  if (coords) {
    coordinateCache[location] = coords;
    localStorage.setItem("coordinateCache", JSON.stringify(coordinateCache));
  }
  return coords;
}

async function getWeatherData(coords) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}`
  ).then((res) => res.json());
}

async function search(location = "") {
  const data = Alpine.store("data");
  if (!location.length) location = data.currentCity;
  if (!location) return;
  const loc = await getLatLong(location);
  data.weatherData = await getWeatherData(loc);
  if (!data.recentCities.includes(location)) {
    data.recentCities.push(location);
    localStorage.setItem("recentCities", JSON.stringify(data.recentCities));
  }
  data.currentCity = "";
}
