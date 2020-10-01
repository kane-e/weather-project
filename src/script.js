$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip({
    container: "body",
  });
});

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

$("#location-button").click(function () {
  // retrieves current coordinates
  navigator.geolocation.getCurrentPosition(getPosition);
});

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

$("#random-button").click(function () {
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
});

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

$(".search-form").submit(function (event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");
  let searchArray = searchInput.value.split(",");
  //test for zip,country
  if (!isNaN(searchInput)) {
    searchZip(searchInput);
    // zipcode and country
  } else if (searchArray.length == 2 && Number.isInteger(searchArray[0])) {
    searchZip(searchArray[0], searchArray[1]);
  } else {
    //assume city
    searchCity(searchInput.value);
  }
});

function handleError(err) {
  if (err != null && err.response.status == 404) {
    $(".error-wrapper").html(`<div  id="error" aria-hidden="true">
    Couldn't find that!<br> Click on the monkey to search again.<div><button onClick="window.location.reload();" id="reload"> 🙈</button></div>
    </div>`);
  }
}

function getWeather(response) {
  // Display greeting then date/time
  $(".header")
    .html(function () {
      let hours = new Date().getHours();
      if (hours < 12) {
        $(".header").text("Good Morning");
      }
      if (hours >= 12 && hours <= 16) {
        $(".header").text("Good Afternoon");
      }
      if (hours >= 17) {
        $(".header").text("Good Evening");
      }
    })
    .fadeOut(5000, function () {
      $(this)
        .html(formatDate(response.data.dt * 1000))
        .fadeIn(5000);
    });

  // Current conditions
  fahrenheitTemperature = response.data.main.temp;
  $("#current-temp").html(Math.round(fahrenheitTemperature));
  $("h1").html(`${response.data.name}, ${response.data.sys.country}`);
  $("#wind").html(Math.round(response.data.wind.speed));
  $("#humidity").html(response.data.main.humidity);
  $(".current-condition").html(response.data.weather[0].main);

  // Set current icon
  $("#icon").attr({
    src: `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
    alt: response.data.weather[0].description,
  });

  // Set background image
  let currentIcon = response.data.weather[0].icon;
  let $body = $("body");
  if (
    currentIcon === "04d" ||
    currentIcon === "04n" ||
    currentIcon === "02d" ||
    currentIcon === "03d" ||
    currentIcon === "03n"
  ) {
    $body.css("background", `url(images/clouds2.jpg)`);
  }
  if (currentIcon === "02n") {
    $body.css(`background`, `url(images/clouds-night2.jpg)`);
  }
  if (currentIcon === "01d") {
    $body.css(`background`, `url(images/clear-day.jpg)`);
  }
  if (currentIcon === "01n") {
    $body.css(`background`, `url(images/clear-night3.jpg)`);
  }
  if (
    currentIcon === "09d" ||
    currentIcon === "09n" ||
    currentIcon === "10d" ||
    currentIcon === "10n"
  ) {
    $body.css(`background`, `url(images/rain2.jpg)`);
  }
  if (currentIcon === "11d" || currentIcon === "11n") {
    $body.css(`background`, `url(images/thunder.jpg)`);
  }
  if (currentIcon === "13d" || currentIcon === "13n") {
    $body.css(`background`, `url(images/snow.jpg)`);
  }
  if (currentIcon === "50d" || currentIcon === "50n") {
    $body.css(`background`, `url(images/mist.jpg)`);
  }
  $body.css("background-size", "105% 105%");
  // Retrieve forecast api
  let lat = response.data.coord.lat;
  let lon = response.data.coord.lon;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&
    exclude=minutely&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(getForecast);
  axios.get(apiUrl).then(getHourly);
}

function getForecastDay(timestamp) {
  let dt = new Date(timestamp);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[dt.getDay()];
  return `${day}`;
}

function getForecast(response) {
  let forecastElement = document.querySelector(".forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  // set current high and current low
  currentFahrenheitHigh = response.data.daily[0].temp.max;
  currentFahrenheitLow = response.data.daily[0].temp.min;
  $("#current-high").html(Math.round(currentFahrenheitHigh));
  $("#current-low").html(Math.round(currentFahrenheitLow));

  //display forecast
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

function getHourly(response) {
  event.preventDefault();
  //display hourly forecast
  let hourlyElement = document.querySelector(".hourly");
  hourlyElement.innerHTML = null;
  let hourly = null;

  for (let index = 1; index < 6; index++) {
    hourly = response.data.hourly[index];
    hourlyFahrenheitHigh = hourly.temp;

    hourlyElement.innerHTML += `<div class="col col-xs-1">
          <div style="font-size:14px">${formatHours(hourly.dt * 1000)}</div>
          <div> <span class="hourly-high" style="font-size:20px">${Math.round(
            hourlyFahrenheitHigh
          )}</span>°</div>
          <div><img src="http://openweathermap.org/img/wn/${
            hourly.weather[0].icon
          }@2x.png"></div>
          
          </div>`;
  }
}

//Toggle daily and hourly forecasts
let $dailyLink = $("#daily-link");
let $hourlyLink = $("#hourly-link");
$hourlyLink.click(function (event) {
  event.preventDefault();
  $(".forecast").addClass("hide");
  $(".hourly").removeClass("hide");
  $("#daily-link").toggleClass("not-active active");
  $("#hourly-link").toggleClass("not-active active");
});

$dailyLink.click(function (event) {
  event.preventDefault();
  $(".forecast").removeClass("hide");
  $(".hourly").addClass("hide");
  $("#daily-link").toggleClass("not-active active");
  $("#hourly-link").toggleClass("not-active active");
});

// Celsius Conversions
let $celsiusLink = $("#celsius-link");
let $fahrenheitLink = $("#fahrenheit-link");
$celsiusLink.click(function (event) {
  event.preventDefault();
  $fahrenheitLink.toggleClass("not-active active");
  $celsiusLink.toggleClass("not-active active");

  // Current temperature conversions
  let celsiusTemperature = (fahrenheitTemperature - 32) * (5 / 9);
  let currentCelsiusHigh = (currentFahrenheitHigh - 32) * (5 / 9);
  let currentCelsiusLow = (currentFahrenheitLow - 32) * (5 / 9);
  $("#current-high").html(`${Math.round(currentCelsiusHigh)}`);
  $("#current-low").html(`${Math.round(currentCelsiusLow)}`);
  $("#current-temp").html(Math.round(celsiusTemperature));
  // Daily forecast conversions
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
  // Hourly forecast conversion
  let hourlyHigh = document.querySelectorAll(".hourly-high");
  hourlyHigh.forEach(function (hourlyHigh) {
    let hourlyCelsiusHigh = (hourlyHigh.innerHTML - 32) * (5 / 9);
    hourlyHigh.innerHTML = `${Math.round(hourlyCelsiusHigh)}`;
  });

  // Wind conversion
  let kilometerSpeed = wind.innerHTML * 1.6;
  $("#wind").html(`${Math.round(kilometerSpeed)}`);
  $("#wind-unit").html(" kph");
});
//Fahrenheit Conversions
$fahrenheitLink.click(function (event) {
  event.preventDefault();
  $fahrenheitLink.toggleClass("not-active active");
  $celsiusLink.toggleClass("not-active active");

  // Current temperature conversions
  $("#current-temp").html(Math.round(fahrenheitTemperature));
  $("#current-high").html(`${Math.round(currentFahrenheitHigh)}`);
  $("#current-low").html(`${Math.round(currentFahrenheitLow)}`);
  // Daily forecast conversions
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
  // Hourly forecast conversion
  let hourlyHigh = document.querySelectorAll(".hourly-high");
  hourlyHigh.forEach(function (hourlyHigh) {
    hourlyFahrenheitHigh = hourlyHigh.innerHTML;
    hourlyHigh.innerHTML = `${Math.round((hourlyFahrenheitHigh * 9) / 5 + 32)}`;
  });
  // Wind conversion
  let mileSpeed = wind.innerHTML / 1.6;
  $("#wind").html(`${Math.round(mileSpeed)}`);
  $("#wind-unit").html(" mph");
});

let apiKey = "0d71af642be5de39b82dbc1fda436287";

let fahrenheitTemperature = null;
let forecastFahrenheitHigh = null;
let forecastFahrenheitLow = null;
let currentFahrenheitHigh = null;
let currentFahrenheitLow = null;
let hourlyFahrenheitHigh = null;

searchCity("Tokyo");
