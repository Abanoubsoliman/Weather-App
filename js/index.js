const API_KEY = '7d77b96c972b4d119a3151101212704'; 


const dateUtils = {
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  
  formatDate: (dateString) => {
    const date = new Date(dateString);
    return {
      dayName: dateUtils.days[date.getDay()],
      date: date.getDate(),
      month: dateUtils.months[date.getMonth()]
    };
  }
};


let searchTimer;
document.getElementById("search").addEventListener("input", (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => search(e.target.value), 500);
});

async function search(location) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=3`
    );
    
    if (!response.ok) throw new Error('Location not found');
    
    const data = await response.json();
    updateUI(data);
    
  } catch (error) {
    showError(error.message);
  }
}

function updateUI(data) {
  const { location, current, forecast } = data;
  

  displayCurrentWeather(location, current);
  

  displayForecast(forecast.forecastday.slice(1));
}

function displayCurrentWeather(location, current) {
  const date = dateUtils.formatDate(current.last_updated);
  
  const currentHTML = `
    <div class="today forecast">
      <div class="forecast-header" id="today">
        <div class="day">${date.dayName}</div>
        <div class="date">${date.date} ${date.month}</div>
      </div>
      <div class="forecast-content" id="current">
        <div class="location">${location.name}</div>
        <div class="degree">
          <div class="num">${current.temp_c}<sup>°C</sup></div>
          <div class="forecast-icon">
            <img src="https:${current.condition.icon}" alt="${current.condition.text}" width="90">
          </div>
        </div>
        <div class="custom">${current.condition.text}</div>
        <div class="weather-details">
          <span><img src="css/imges/icon-umberella.png" alt="">${current.humidity}%</span>
          <span><img src="css/imges/icon-wind.png" alt="">${current.wind_kph}km/h</span>
          <span><img src="css/imges/icon-compass.png" alt="">${current.wind_dir}</span>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById("forecast").innerHTML = currentHTML;
}

function displayForecast(forecastDays) {
  let forecastHTML = '';
  
  forecastDays.forEach(day => {
    const date = dateUtils.formatDate(day.date);
    
    forecastHTML += `
      <div class="forecast">
        <div class="forecast-header">
          <div class="day">${date.dayName}</div>
        </div>
        <div class="forecast-content">
          <div class="forecast-icon">
            <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" width="48">
          </div>
          <div class="degree">${day.day.maxtemp_c}<sup>°C</sup></div>
          <small>${day.day.mintemp_c}<sup>°C</sup></small>
          <div class="custom">${day.day.condition.text}</div>
        </div>
      </div>
    `;
  });
  
  document.getElementById("forecast").innerHTML += forecastHTML;
}

function showError(message) {
  const errorHTML = `
    <div class="error-message">
      <p>⚠️ ${message}</p>
    </div>
  `;
  
  document.getElementById("forecast").innerHTML = errorHTML;
}


search("cairo");