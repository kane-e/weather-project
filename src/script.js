function formatDate(timestamp) {
  let date = new Date(timestamp);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];
  let months = [
    "Jan",
    "Feb",
    "March",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[date.getMonth()];
  let number = date.getDate();
  return `${day} ${month} ${number}, ${formatHours(timestamp)}`;
}
function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}

function runGeo() {
  navigator.geolocation.getCurrentPosition(getPosition);
}

function getPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(getWeather);
}

function searchCity(city) {
  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(getWeather);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(getForecast);
}

function getForecast(response) {
  console.log(response.data);
  document.querySelector("#day-one-high").innerHTML = Math.round(
    response.data.list[7].main.temp_max
  );
  document.querySelector("#day-two-high").innerHTML = Math.round(
    response.data.list[15].main.temp_max
  );
  document.querySelector("#day-three-high").innerHTML = Math.round(
    response.data.list[23].main.temp_max
  );
  document.querySelector("#day-four-high").innerHTML = Math.round(
    response.data.list[31].main.temp_max
  );
  document.querySelector("#day-five-high").innerHTML = Math.round(
    response.data.list[39].main.temp_max
  );
}

function getCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-input");
  searchCity(cityInput.value);
}

function getWeather(response) {
  fahrenheitTemperature = response.data.main.temp;
  document.querySelector("#current-temp").innerHTML = Math.round(
    fahrenheitTemperature
  );
  document.querySelector(
    "h1"
  ).innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  document.querySelector("#high").innerHTML = Math.round(
    response.data.main.temp_max
  );
  document.querySelector("#low").innerHTML = Math.round(
    response.data.main.temp_min
  );
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector(".current-condition").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#date-time").innerHTML = formatDate(
    response.data.dt * 1000
  );

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

function getCelsius(event) {
  event.preventDefault();
  let celsiusTemperature = (fahrenheitTemperature - 32) * (5 / 9);
  document.querySelector("#current-temp").innerHTML = Math.round(
    celsiusTemperature
  );

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}
function getFahrenheit(event) {
  event.preventDefault();
  document.querySelector("#current-temp").innerHTML = Math.round(
    fahrenheitTemperature
  );
  fahrenheitLink.classList.add("active");
  celsiusLink.classList.remove("active");
}

let apiKey = "0d71af642be5de39b82dbc1fda436287";

let searchForm = document.querySelector(".search-form");
searchForm.addEventListener("click", getCity);

let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", runGeo);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", getCelsius);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", getFahrenheit);

let fahrenheitTemperature = null;

searchCity("Tokyo");
