// Variables
const api = "https://api.openweathermap.org/data/2.5/forecast";
const apiKey = "925c70324dece63089d9784a7f037499";
const searchBar = document.querySelector(".search-bar");
const cityInput = searchBar.querySelector(".city-input");
const countryInput = searchBar.querySelector(".country-input");
const searchHistory = document.querySelector(".search-history");
const btn = document.querySelector(".btn")
// Click func.
btn.addEventListener("click", function () {
  const city = cityInput.value;
  const country = countryInput.value;
  fetchForecast(city, country);
});
// Fetch forecast
function fetchForecast(city, country) {
  fetch(`${api}?q=${city},${country}&units=imperial&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const forecastData = data.list.slice(0, 5);
      const cityName = data.city.name;
      const cityTitle = document.querySelector(".city-title");
      cityTitle.textContent = cityName;

      forecastData.forEach((forecast, index) => {
        const forecastCard = document.getElementsByClassName("card")[index];
        const date = new Date(forecast.dt_txt);
        const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });
        const temperature = Math.round(forecast.main.temp);
        const humidity = forecast.main.humidity;
        const windSpeed = Math.round(forecast.wind.speed);
        const weatherIcon = forecast.weather[0].icon;
        const weatherDescription = forecast.weather[0].description;

        forecastCard.querySelector(".date").textContent = `${dayOfWeek}, ${date.getMonth()+1}/${date.getDate()}`;
        forecastCard.querySelector(".temp").textContent = `${temperature}\xB0F`;
        forecastCard.querySelector(".description").textContent = weatherDescription;
        forecastCard.querySelector(".humidity").textContent = `Humidity: ${humidity}%`;
        forecastCard.querySelector(".wind").textContent = `Wind Speed: ${windSpeed} mph`;
        forecastCard.querySelector(".icon").setAttribute("src", `http://openweathermap.org/img/w/${weatherIcon}.png`);
      });

      const searchHistory = localStorage.setItem( `${city}, ${country}`);
       searchHistory(searchHistory);

    })
    .catch(error => console.error(error));
}
