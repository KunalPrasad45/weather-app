const API_KEY = "e780490e229842fdadf180141251509";
    const BASE_URL = "https://api.weatherapi.com/v1";

    function startApp() {
      document.getElementById("intro").style.display = "none";
      document.getElementById("app").style.display = "block";
      getWeather("Delhi, India"); // default city
    }

    async function getWeather(city) {
      city = city || document.getElementById("cityInput").value || "Delhi, India";
      const errorBox = document.getElementById("error");
      errorBox.textContent = "";
      try {
        const res = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=no&alerts=no`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error?.message || "Failed to fetch");
        }
        const data = await res.json();
        showWeather(data);
      } catch (e) {
        errorBox.textContent = e.message;
      }
    }

    function getIcon(condition) {
      const c = condition.toLowerCase();
      if (c.includes("rain")) return '<i class="fas fa-cloud-showers-heavy"></i>';
      if (c.includes("cloud")) return '<i class="fas fa-cloud"></i>';
      if (c.includes("sun") || c.includes("clear")) return '<i class="fas fa-sun"></i>';
      if (c.includes("snow")) return '<i class="fas fa-snowflake"></i>';
      return '<i class="fas fa-smog"></i>';
    }

    function showWeather(data) {
      const currentBox = document.getElementById("current");
      currentBox.innerHTML = `
        <h2>${data.location.name}, ${data.location.country}</h2>
        <h3>${data.current.temp_c}°C, ${data.current.condition.text}</h3>
        ${getIcon(data.current.condition.text)}
        <p>Humidity: ${data.current.humidity}% | Wind: ${data.current.wind_kph} kph</p>
      `;

      // Hourly forecast (next 6 hours)
      const hourlyBox = document.getElementById("hourly");
      hourlyBox.innerHTML = "";
      const hours = data.forecast.forecastday[0].hour;
      const nowHour = new Date().getHours();
      for (let i = 0; i < 6; i++) {
        const h = hours[(nowHour + i) % 24];
        hourlyBox.innerHTML += `
          <div>
            <p>${h.time.split(" ")[1]}</p>
            ${getIcon(h.condition.text)}
            <p>${h.temp_c}°C</p>
          </div>
        `;
      }

      // Daily forecast (next 5 days)
      const dailyBox = document.getElementById("daily");
      dailyBox.innerHTML = "";
      data.forecast.forecastday.forEach(day => {
        dailyBox.innerHTML += `
          <div>
            <p>${day.date}</p>
            ${getIcon(day.day.condition.text)}
            <p>${day.day.avgtemp_c}°C</p>
          </div>
        `;
      });
    }

    