/** @type {import("alpinejs/index.d.ts").Alpine} */
var Alpine = window.Alpine;

const apiKey = "e229231d710a9cebff255e2b499ccac6";

document.addEventListener("alpine:init", () => {
  let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
  Alpine.store("data", { recentCities, currentCity: "" });
});

function search() {
  const data = Alpine.store("data");
  if (!data.currentCity.length) return;
  data.recentCities.push(data.currentCity);
  data.currentCity = "";
  localStorage.setItem("recentCities", JSON.stringify(data.recentCities));
}
