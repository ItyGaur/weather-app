const API_KEY = "ffd204e4238d42d4b9f185118261901";

const cityEl = document.getElementById("city");
const tempEl = document.getElementById("temp");
const descEl = document.getElementById("desc");
const iconEl = document.getElementById("icon");
const forecastEl = document.getElementById("forecast");
const hourlyEl = document.getElementById("hourly");
const searchInput = document.getElementById("search");
const bg = document.querySelector(".bg");

let locationLoaded = false;

async function getWeather(city) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city},IN&days=3`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.error) {
    alert("City not found");
    return;
  }

  cityEl.innerText = `${data.location.name}, ${data.location.country}`;
  tempEl.innerText = `${Math.round(data.current.temp_c)}°C`;
  descEl.innerText = data.current.condition.text;
  iconEl.src = "https:" + data.current.condition.icon;

changeBackground(
  data.current.condition.text,
  data.current.is_day
);

  forecastEl.innerHTML = "";
  data.forecast.forecastday.forEach(day => {
    forecastEl.innerHTML += `
      <div class="day">
        <p>${day.date}</p>
        <img src="https:${day.day.condition.icon}">
        <p>${day.day.maxtemp_c}° / ${day.day.mintemp_c}°</p>
      </div>
    `;
  });

  hourlyEl.innerHTML = "";
  data.forecast.forecastday[0].hour.forEach((h, i) => {
    if (i % 3 === 0) {
      hourlyEl.innerHTML += `
        <div class="hour">
          <p>${h.time.split(" ")[1]}</p>
          <img src="https:${h.condition.icon}">
          <p>${Math.round(h.temp_c)}°</p>
        </div>
      `;
    }
  });
}

function searchCity() {
  const city = searchInput.value.trim();
  if (city) {
    locationLoaded = true;
    getWeather(city);
  }
}

function changeBackground(condition, isDay) {
  const text = condition.toLowerCase();

  // 🌙 NIGHT (priority)
  if (isDay === 0) {
    bg.style.background =
      "linear-gradient(135deg, #0f2027, #203a43, #2c5364)";
    return;
  }

  // ☀️ DAY WEATHER
  if (text.includes("sunny") || text.includes("clear")) {
    bg.style.background =
      "linear-gradient(135deg, #dcd062, #eb9d2e)";
  }
  else if (text.includes("cloud")) {
    bg.style.background =
      "linear-gradient(135deg, #bdc3c7, #2c3e50)";
  }
  else if (text.includes("rain") || text.includes("drizzle")) {
    bg.style.background =
      "linear-gradient(135deg, #314755, #145979)";
  }
  else if (text.includes("snow")) {
    bg.style.background =
      "linear-gradient(135deg, #e6dada, #274046)";
  }
  else {
    bg.style.background =
      "linear-gradient(135deg, #78cdea, #122743)";
  }
}



window.onload = () => {
  getWeather("Delhi");
};
