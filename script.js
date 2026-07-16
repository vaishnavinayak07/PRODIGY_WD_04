import { API_KEY } from "./config.js";

const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";

const input = document.getElementById("input");
const search = document.getElementById("search");
const cloudImage = document.getElementById("cloudImage");
const statusEl = document.getElementById("status");

const cloudTempEl = document.getElementById("CloudTemp");
const humidityCardEl = document.getElementById("humidityCard");
const windCardEl = document.getElementById("windCard");
const tempEl = document.getElementById("temp");
const cityEl = document.getElementById("city");
const humidityEl = document.getElementById("humidity");
const speedEl = document.getElementById("speed");

const conditionImages = {
  Clouds: "images/clouds.png",
  Clear: "images/clear.png",
  Drizzle: "images/drizzle.png",
  Mist: "images/mist.png",
  Rain: "images/rain.png",
  Snow: "images/snow.png",
  Thunderstorm: "images/rain.png",
  Haze: "images/mist.png",
  Fog: "images/mist.png",
};

function showStatus(message) {
  statusEl.textContent = message;
  statusEl.classList.remove("hidden");
}

function hideStatus() {
  statusEl.classList.add("hidden");
  statusEl.textContent = "";
}

function showError(message) {
  cityEl.innerHTML = message;
  tempEl.innerHTML = "--";
  humidityEl.innerHTML = "--";
  speedEl.innerHTML = "--";

  cloudTempEl.classList.remove("hidden");
  humidityCardEl.classList.add("hidden");
  cloudImage.src = "images/clouds.png";
}

function capitalize(text) {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function weatherInfo(city) {
  if (!city) return;

  hideStatus();
  showStatus("Loading...");

  try {
    const response = await fetch(
      `${apiUrl}&q=${encodeURIComponent(city)}&appid=${API_KEY}`
    );

    const data = await response.json();

    hideStatus();

    if (String(data.cod) !== "200") {
      const message = data.message
        ? capitalize(data.message)
        : "Something Went Wrong";
      showError(message);
      return;
    }

    tempEl.innerHTML = Math.round(data.main.temp) + "°C";
    cityEl.innerHTML = data.name;
    humidityEl.innerHTML = data.main.humidity + "%";
    speedEl.innerHTML = data.wind.speed + " Km/h";

    cloudTempEl.classList.remove("hidden");
    humidityCardEl.classList.remove("hidden");
    windCardEl.classList.remove("hidden");

    const condition = data.weather && data.weather[0] ? data.weather[0].main : "";
    cloudImage.src = conditionImages[condition] || "images/clouds.png";
  } catch (err) {
    console.error("Weather fetch failed:", err);
    hideStatus();
    showError("Something Went Wrong");
  }
}

search.addEventListener("click", () => {
  weatherInfo(input.value.trim());
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    weatherInfo(input.value.trim());
  }
});