import { WeatherData, City } from '../types/weather';

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

export async function getWeatherData(lat: number, lon: number): Promise<WeatherData> {
  checkApiKey();

  const response = await fetch(
    `${BASE_URL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`
  );
  
  if (!response.ok) {
    const error = await response.json();
    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your OpenWeather API key in .env.local');
    }
    throw new Error(error.message || 'Failed to fetch weather data');
  }
  
  return response.json();
}

export async function searchCities(query: string): Promise<City[]> {
  checkApiKey();

  if (!query.trim()) {
    return [];
  }

  try {
    const url = `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
    console.log('Making request to:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        error: error
      });
      
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenWeather API key in .env.local');
      }
      throw new Error(error.message || 'Failed to fetch cities');
    }
    
    const data = await response.json();
    return data.map((city: any) => ({
      name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon,
    }));
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
}

export function getWeatherIcon(code: string): string {
  return `https://openweathermap.org/img/wn/${code}@2x.png`;
} 