// Define the API endpoint and API key
const api = "https://api.openweathermap.org/data/2.5/forecast";
const apiKey = "925c70324dece63089d9784a7f037499";

// Get the search bar elements
const searchBar = document.querySelector(".search-bar");
const cityInput = searchBar.querySelector("input[type='text']:nth-of-type(1)");
const countryInput = searchBar.querySelector("input[type='text']:nth-of-type(2)");
const button = searchBar.querySelector("button");

// Get the search history element
const searchHistory = document.querySelector(".search-history");

// Add an event listener to the button to fetch the forecast data when clicked
button.addEventListener("click", () => {
  const city = cityInput.value;
  const country = countryInput.value;
  fetchForecast(city, country);
});

// Function to fetch the forecast data from the API
function fetchForecast(city, country) {
  fetch(`${api}?q=${city},${country}&units=imperial&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      // Extract the forecast data for the next 5 days
      const forecastData = data.list.slice(0, 5);

      // Get the city name from the API data
      const cityName = data.city.name;

      // Display the city name in the HTML
      const cityTitle = document.querySelector(".city-title");
      cityTitle.textContent = cityName;

      // Loop through the forecast data and display it in the HTML
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

      // Save the search query to localStorage
      const searchQuery = `${city}, ${country}`;
      searchQuery(searchQuery);

    })
    .catch(error => console.error(error));
}
