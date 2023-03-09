const openWeatherApiKey = 'YOUR_OPEN_WEATHER_API_KEY';
const getFestivoApiKey = 'YOUR_GETFESTIVO_API_KEY';

const modal = document.getElementById('modal');
const searchList = document.getElementById('search-list');

function showModal() {
  modal.style.display = 'block';
  loadRecentSearches();
}

function closeModal() {
  modal.style.display = 'none';
}

function searchLocation(event) {
  event.preventDefault();
  
  const locationInput = document.getElementById('location');
  const location = locationInput.value;
  getWeather(location);
  getHolidays();
  saveRecentSearch(location);
  closeModal();
  locationInput.value = '';
}

function loadRecentSearches() {
  const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
  searchList.innerHTML = recentSearches.map(search => `<li>${search}</li>`).join('');
}

function saveRecentSearch(search) {
  const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
  if (!recentSearches.includes(search)) {
    recentSearches.push(search);
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    loadRecentSearches();
  }
}
function getWeather(location) {
    const today = new Date();
    const start = new Date(today);
    const end = new Date(today);
    end.setDate(end.getDate() + 4);
    
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${openWeatherApiKey}`)
      .then(response => response.json())
      .then(data => {
        const weatherDiv = document.querySelector('#weather');
        const forecasts = data.list.filter(forecast => {
          const date = new Date(forecast.dt * 1000);
          return date >= start && date <= end && date.getHours() === 12;
        });
        weatherDiv.innerHTML = `
          <h2>Weather Forecast for ${location}</h2>
          ${forecasts.map(forecast => `
            <div>
            <p>${new Date(forecast.dt * 1000).toLocaleDateString()}</p>
            <p>Temperature: ${(forecast.main.temp - 273.15).toFixed(1)} &deg;C</p>
            <p>Description: ${forecast.weather[0].description}</p>
            <img src="http://openweathermap.org/img/w/${forecast.weather[0].icon}.png">
          </div>
        `).join('')}
      `;
    })
    .catch(error => console.error(error));
}
function getHolidays() {
    const today = new Date();
    const start = new Date(today);
    const end = new Date(today);
    end.setDate(end.getDate() + 6);
    
    fetch(`https://getfestivo.com/v1/holidays?api_key=${getFestivoApiKey}&country=US&year=${end.getFullYear()}`)
      .then(response => response.json())
      .then(data => {
        const holidaysDiv = document.querySelector('#holidays');
        const holidays = data.holidays.filter(holiday => {
          const date = new Date(holiday.date.iso);
          return date >= start && date <= end;
        });
        holidaysDiv.innerHTML = `
          <h2>Holidays in the Next 7 Days</h2>
          ${holidays.map(holiday => `
            <div>
              <p>${new Date(holiday.date.iso).toLocaleDateString()}</p>
              <p>${holiday.name}</p>
            </div>
          `).join('')}
        `;
    })
    .catch(error => console.error(error));
}
