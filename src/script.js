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
  axios
    .get(apiUrl)
    .then(getWeather)
    .catch((err) => handleError(err));
}

function searchCity(city) {
  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios
    .get(apiUrl)
    .then(getWeather)
    .catch((err) => handleError(err));
}

function searchRandomCity(event) {
  let cities = [
    "London",
    "New York",
    "Sao Paulo",
    "Moscow",
    "Lima",
    "Madrid",
    "Seoul",
    "Jakarta",
    "Cairo",
  ];

  let randomCity = Math.floor(Math.random() * 10);
  let city = (randomCity, cities[randomCity]);

  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(getWeather);
}

function searchZip(zip, countryCode) {
  let units = "imperial";
  let apiUrl = `api.openweathermap.org/data/2.5/weather?zip=${
    (zip, countryCode)
  }&appid=${apiKey}&units=${units}`;

  axios
    .get(apiUrl)
    .then(getWeather)
    .catch((err) => handleError(err));
}

function getCity(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");

  let searchArray = searchInput.value.split(",");
  //test for zip,country
  if (!isNaN(searchInput)) {
    searchZip(searchInput, "");
  } else if (searchArray.length == 2 && Number.isInteger(searchArray[0])) {
    // zipcode and country
    searchZip(searchArray[0], searchArray(1));
  } else {
    //assume city
    searchCity(searchInput.value);
  }
}

function handleError(err) {
  if (err != null && err.response.status == 404) {
    document
      .querySelector(".error-wrapper")
      .addEventListener("click", function () {});
    document.querySelector(
      ".error-wrapper"
    ).innerHTML = `<div  id="error" aria-hidden="true">
         Couldn't find that!<br> Click on the monkey to search again.<div><button onClick="window.location.reload();" id="reload"> 🙈</button></div>
      </div>`;
  }
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

  document.querySelector("#current-high").innerHTML = Math.round(
    response.data.daily[0].temp.max
  );
  document.querySelector("#current-low").innerHTML = Math.round(
    response.data.daily[0].temp.min
  );
  currentFahrenheitHigh = response.data.daily[0].temp.max;
  currentFahrenheitLow = response.data.daily[0].temp.min;

  for (let index = 1; index < 6; index++) {
    forecast = response.data.daily[index];
    forecastFahrenheitHigh = forecast.temp.max;
    forecastFahrenheitLow = forecast.temp.min;

    forecastElement.innerHTML += `<div class="col col-xs-1">
          <div>${getForecastDay(forecast.dt * 1000)}</div>
          <div> <span class="forecast-high">${Math.round(
            forecastFahrenheitHigh
          )}</span>°</div>
          <div><img src="http://openweathermap.org/img/wn/${
            forecast.weather[0].icon
          }@2x.png"></div>
          <div><span class="forecast-low">${Math.round(
            forecastFahrenheitLow
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
  fahrenheitLink.addEventListener("click", getFahrenheit);
  celsiusLink.removeEventListener("click", getCelsius);

  let celsiusTemperature = (fahrenheitTemperature - 32) * (5 / 9);
  let currentCelsiusHigh = (currentFahrenheitHigh - 32) * (5 / 9);
  let currentCelsiusLow = (currentFahrenheitLow - 32) * (5 / 9);
  let celsiusHigh = document.querySelector("#current-high");
  let celsiusLow = document.querySelector("#current-low");
  celsiusHigh.innerHTML = `${Math.round(currentCelsiusHigh)}`;
  celsiusLow.innerHTML = `${Math.round(currentCelsiusLow)}`;

  document.querySelector("#current-temp").innerHTML = Math.round(
    celsiusTemperature
  );
  let high = document.querySelectorAll(".forecast-high");
  let low = document.querySelectorAll(".forecast-low");
  high.forEach(function (high) {
    let forecastCelsiusHigh = (high.innerHTML - 32) * (5 / 9);
    high.innerHTML = `${Math.round(forecastCelsiusHigh)}`;
  });
  low.forEach(function (low) {
    let forecastCelsiusLow = (low.innerHTML - 32) * (5 / 9);
    low.innerHTML = `${Math.round(forecastCelsiusLow)}`;
  });

  let wind = document.querySelector("#wind");
  let kilometerSpeed = wind.innerHTML * 1.6;
  wind.innerHTML = `${Math.round(kilometerSpeed)}`;

  let windUnit = document.querySelector("#wind-unit");
  windUnit.innerHTML = " kph";
}

function getFahrenheit(event) {
  event.preventDefault();
  fahrenheitLink.classList.add("active");
  fahrenheitLink.classList.remove("not-active");
  celsiusLink.classList.remove("active");
  celsiusLink.classList.add("not-active");
  fahrenheitLink.removeEventListener("click", getFahrenheit);
  celsiusLink.addEventListener("click", getCelsius);

  document.querySelector("#current-temp").innerHTML = Math.round(
    fahrenheitTemperature
  );
  let fahrenheitHigh = document.querySelector("#current-high");
  let fahrenheitLow = document.querySelector("#current-low");
  fahrenheitHigh.innerHTML = `${Math.round(currentFahrenheitHigh)}`;
  fahrenheitLow.innerHTML = `${Math.round(currentFahrenheitLow)}`;

  let high = document.querySelectorAll(".forecast-high");
  let low = document.querySelectorAll(".forecast-low");
  high.forEach(function (high) {
    let forecastFahrenheitHigh = high.innerHTML;
    high.innerHTML = `${Math.round((forecastFahrenheitHigh * 9) / 5 + 32)}`;
  });
  low.forEach(function (low) {
    let forecastFahrenheitLow = low.innerHTML;
    low.innerHTML = `${Math.round((forecastFahrenheitLow * 9) / 5 + 32)}`;
  });

  let wind = document.querySelector("#wind");
  let mileSpeed = wind.innerHTML / 1.6;
  wind.innerHTML = `${Math.round(mileSpeed)}`;

  let windUnit = document.querySelector("#wind-unit");
  windUnit.innerHTML = " mph";
}
function randomButtonText(event) {
  document.querySelector(
    "#location-button"
  ).innerHTML = `<span aria-hidden="true" class="random-button-text">Search random city</span>`;
}

let apiKey = "0d71af642be5de39b82dbc1fda436287";

let searchForm = document.querySelector(".search-form");
searchForm.addEventListener("submit", getCity);

let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", runGeo);

let randomButton = document.querySelector("#random-button");
randomButton.addEventListener("click", searchRandomCity);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", getCelsius);

let fahrenheitLink = document.querySelector("#fahrenheit-link");

let fahrenheitTemperature = null;
let forecastFahrenheitHigh = null;
let forecastFahrenheitLow = null;
let currentFahrenheitHigh = null;
let currentFahrenheitLow = null;

searchCity("Tokyo");
