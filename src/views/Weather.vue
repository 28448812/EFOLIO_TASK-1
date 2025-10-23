<template>
  <div class="weather-search-container">
    <div class="weather-header">
      <h1 class="main-title">Weather query</h1>
      <div class="userWrip">
        <div class="username-display">{{ userName }}</div>
        <LogoutButton />
      </div>
    </div>

    <div class="weather-content">
      <div class="search-section">
        <div class="input-group">
          <input
            v-model="cityName"
            type="text"
            placeholder="Enter the city name (eg Beijing, Shanghai, London)"
            class="search-input"
            @keyup.enter="searchWeather"
          />
          <button @click="searchWeather" class="search-btn" :disabled="loading">
            {{ loading ? 'Searching...' : 'Search' }}
          </button>
        </div>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-if="weatherData" class="weather-result">
        <div class="weather-card">
          <div class="weather-header-info">
            <h2 class="city-name">{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
            <div class="temperature">{{ Math.round(weatherData.main.temp) }}°C</div>
          </div>
          
          <div class="weather-details">
            <div class="weather-main">
              <div class="weather-icon">
                <img 
                  :src="`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`" 
                  :alt="weatherData.weather[0].description"
                />
              </div>
              <div class="weather-description">
                {{ weatherData.weather[0].description }}
              </div>
            </div>
            
            <div class="weather-stats">
              <div class="stat-item">
                <span class="stat-label">Body temperature:</span>
                <span class="stat-value">{{ Math.round(weatherData.main.feels_like) }}°C</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Humidity:</span>
                <span class="stat-value">{{ weatherData.main.humidity }}%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Air pressure:</span>
                <span class="stat-value">{{ weatherData.main.pressure }} hPa</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Wind speed:</span>
                <span class="stat-value">{{ weatherData.wind.speed }} m/s</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Visibility:</span>
                <span class="stat-value">{{ weatherData.visibility / 1000 }} km</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { onMounted, ref } from 'vue'
import LogoutButton from '@/components/LogoutButton.vue'
import axios from 'axios'

const cityName = ref('')
const weatherData = ref(null)
const loading = ref(false)
const error = ref('')
const userName = localStorage.getItem('userName')

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

const searchWeather = async () => {
  if (!cityName.value.trim()) {
    error.value = 'Please enter city name'
    return
  }

  loading.value = true
  error.value = ''
  weatherData.value = null

  try {
    // first step: get city coordinates
    const geoResponse = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName.value)}&appid=${API_KEY}`
    )

    if (!geoResponse.data || geoResponse.data.length === 0) {
      throw new Error('The city was not found. Please check if the city name is correct.')
    }

    const cityInfo = geoResponse.data[0]
    const { lat, lon } = cityInfo

    // second step: get weather data using coordinates
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=zh_cn`
    )

    weatherData.value = weatherResponse.data
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to obtain weather information'
  } finally {
    loading.value = false
  }
}

onMounted(()=>{
  // axios.get('http://127.0.0.1:5001/cxre-423d7/us-central1/helloWorldCors')
  // axios.get('https://us-central1-cxre-423d7.cloudfunctions.net/helloWorldCors')
  // axios.get('https://us-central1-cxre-423d7.cloudfunctions.net/countItems')
})
</script>

<style scoped>
.weather-search-container {
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  min-height: 100vh;
  background: #f5f5f7;
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
  gap: 1rem;
}

.main-title {
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

.userWrip {
  display: flex;
  gap: 10px;
  align-items: center;
}

.username-display {
  color: #34495e;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  background: #ecf0f1;
  border-radius: 6px;
  white-space: nowrap;
}

.weather-content {
  max-width: 600px;
  margin: 0 auto;
}

.search-section {
  margin-bottom: 2rem;
}

.input-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #3498db;
}

.search-btn {
  padding: 12px 24px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-btn:hover:not(:disabled) {
  background: #2980b9;
}

.search-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.error-message {
  background: #e74c3c;
  color: white;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 1rem;
  text-align: center;
}

.weather-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.weather-header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #ecf0f1;
  padding-bottom: 1rem;
}

.city-name {
  color: #2c3e50;
  font-size: 1.5rem;
  margin: 0;
}

.temperature {
  color: #e74c3c;
  font-size: 2.5rem;
  font-weight: bold;
}

.weather-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.weather-icon img {
  width: 80px;
  height: 80px;
}

.weather-description {
  font-size: 1.2rem;
  color: #7f8c8d;
  text-transform: capitalize;
}

.weather-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #ecf0f1;
}

.stat-label {
  color: #7f8c8d;
}

.stat-value {
  color: #2c3e50;
  font-weight: 600;
}

@media (max-width: 768px) {
  .weather-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .input-group {
    flex-direction: column;
  }
  
  .weather-stats {
    grid-template-columns: 1fr;
  }
}
</style>