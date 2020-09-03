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

  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
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
}
function searchZip(zip) {
  let units = "imperial";
  let apiUrl = `api.openweathermap.org/data/2.5/weather?zip = ${zipcode},${statecode},${countrycode}&appid=${apiUrl}&units=${units}`;
  axios.get(apiUrl).then(getWeather);
}

function getCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-input");
  if (isNaN(cityInput.value)) {
    searchCity();
  } else {
    searchZip;
  }
  searchCity(cityInput.value);
}

function getWeather(response) {
  console.log(response.data);
  fahrenheitTemperature = response.data.main.temp;
  document.querySelector("#current-temp").innerHTML = Math.round(
    fahrenheitTemperature
  );

  document.querySelector(
    "h1"
  ).innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  document.querySelector("#current-high").innerHTML = Math.round(
    response.data.main.temp_max
  );
  document.querySelector("#current-low").innerHTML = Math.round(
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
  let lat = response.data.coord.lat;
  let lon = response.data.coord.lon;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&
  exclude= minutely,hourly&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(getForecast);
}
function getForecastDay(timestamp) {
  let dt = new Date(timestamp);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[dt.getDay()];
  return `${day}`;
}
function getForecast(response) {
  console.log(response.data);
  let forecastElement = document.querySelector(".forecast");
  forecastElement.innerHTML = null;
  let forecast = null;
  for (let index = 1; index < 6; index++) {
    forecast = response.data.daily[index];
    forecastElement.innerHTML += `<div class="col col-xs-1">
          <div>${getForecastDay(forecast.dt * 1000)}</div>
          <div> <span class="forecast-high">${Math.round(
            forecast.temp.max
          )}</span>°</div>
          <div><img src="http://openweathermap.org/img/wn/${
            forecast.weather[0].icon
          }@2x.png"></div>
          <div><span class="forecast-low">${Math.round(
            forecast.temp.min
          )}</span>°</div> 
      </div>
    `;
  }
}

function getCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  fahrenheitLink.classList.add("not-active");
  celsiusLink.classList.remove("not-active");

  let celsiusTemperature = (fahrenheitTemperature - 32) * (5 / 9);
  document.querySelector("#current-temp").innerHTML = Math.round(
    celsiusTemperature
  );
  let high = document.querySelectorAll(".forecast-high");
  let low = document.querySelectorAll(".forecast-low");
  high.forEach(function (high) {
    let currentTemp = high.innerHTML;
    high.innerHTML = `${Math.round(((currentTemp - 32) * 5) / 9)}`;
  });

  low.forEach(function (low) {
    let currentTemp = low.innerHTML;
    low.innerHTML = `${Math.round(((currentTemp - 32) * 5) / 9)}`;
  });
  let celsiusHigh = document.querySelector("#current-high");
  let celsiusLow = document.querySelector("#current-low");
  let currentHigh = celsiusHigh.innerHTML;
  let currentLow = celsiusLow.innerHTML;
  celsiusHigh.innerHTML = `${Math.round(((currentHigh - 32) * 5) / 9)}`;
  celsiusLow.innerHTML = `${Math.round(((currentLow - 32) * 5) / 9)}`;
  let kilometerSpeed = document.querySelector("#wind");
  let windUnit = document.querySelector("#wind-unit");
  let currentWind = kilometerSpeed.innerHTML;
  kilometerSpeed.innerHTML = `${Math.round(currentWind * 1.6)}`;
  windUnit.innerHTML = " kph";
}

function getFahrenheit(event) {
  event.preventDefault();
  fahrenheitLink.classList.add("active");
  fahrenheitLink.classList.remove("not-active");
  celsiusLink.classList.remove("active");
  celsiusLink.classList.add("not-active");

  document.querySelector("#current-temp").innerHTML = Math.round(
    fahrenheitTemperature
  );
  let high = document.querySelectorAll(".forecast-high");
  let low = document.querySelectorAll(".forecast-low");
  high.forEach(function (high) {
    let currentTemp = high.innerHTML;
    high.innerHTML = `${Math.round((currentTemp * 9) / 5 + 32)}`;
  });
  low.forEach(function (low) {
    let currentTemp = low.innerHTML;
    low.innerHTML = `${Math.round((currentTemp * 9) / 5 + 32)}`;
  });
  let fahrenheitHigh = document.querySelector("#current-high");
  let fahrenheitLow = document.querySelector("#current-low");
  let currentHigh = fahrenheitHigh.innerHTML;
  let currentLow = fahrenheitLow.innerHTML;
  fahrenheitHigh.innerHTML = `${Math.round((currentHigh * 9) / 5 + 32)}`;
  fahrenheitLow.innerHTML = `${Math.round((currentLow * 9) / 5 + 32)}`;
  let mileSpeed = document.querySelector("#wind");
  let windUnit = document.querySelector("#wind-unit");
  let currentWind = mileSpeed.innerHTML;
  mileSpeed.innerHTML = `${Math.round(currentWind / 1.6)}`;
  windUnit.innerHTML = " mph";
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
let forecastFahrenheit = null;

searchCity("Tokyo");
