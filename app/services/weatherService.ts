import { WeatherData, ForecastData, City } from '../types/weather';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/3.0';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

function checkApiKey() {
  if (!API_KEY) {
    throw new Error('OpenWeather API key is not configured. Please add NEXT_PUBLIC_OPENWEATHER_API_KEY to your .env.local file');
  }
  if (API_KEY === 'your_api_key_here') {
    throw new Error('Please replace the placeholder API key in .env.local with your actual OpenWeather API key');
  }
}

export async function getWeatherData(city: City): Promise<WeatherData> {
  try {
    const response = await fetch(
      `/api/weather?endpoint=weather&lat=${city.lat}&lon=${city.lon}`
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch weather data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

export async function searchCities(query: string): Promise<City[]> {
  try {
    const response = await fetch(`/api/weather?endpoint=geocoding&city=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to search cities');
    }

    const data = await response.json();
    return data.map((city: any) => ({
      name: city.name,
      country: city.country,
      state: city.state,
      lat: city.lat,
      lon: city.lon,
    }));
  } catch (error) {
    console.error('Error searching cities:', error);
    throw error;
  }
}

export function getWeatherIcon(code: string): string {
  return `https://openweathermap.org/img/wn/${code}@2x.png`;
}

export async function getForecastData(city: City): Promise<ForecastData> {
  try {
    const response = await fetch(
      `/api/weather?endpoint=forecast&lat=${city.lat}&lon=${city.lon}`
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch forecast data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
} 