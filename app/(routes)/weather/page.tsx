'use client';

import React, { useState, useEffect } from 'react';
import { WeatherData, City } from '../../types/weather';
import { getWeatherData, getWeatherIcon } from '../../services/weatherService';
import CitySearch from '../../components/CitySearch';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const data = await getWeatherData(
              position.coords.latitude,
              position.coords.longitude
            );
            setWeatherData(data);
          } catch (err) {
            setError('Failed to fetch weather data for your location');
          }
        },
        (err) => {
          setError('Please enable location access or search for a city');
        }
      );
    }
  }, []);

  const handleCitySelect = async (city: City) => {
    setSelectedCity(city);
    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherData(city.lat, city.lon);
      setWeatherData(data);
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const formatChartData = (data: WeatherData) => {
    return data.daily.map((day) => ({
      date: new Date(day.dt * 1000).toLocaleDateString(),
      temperature: day.temp.day,
      min: day.temp.min,
      max: day.temp.max,
      humidity: day.humidity,
      wind_speed: day.wind_speed,
    }));
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <CitySearch onCitySelect={handleCitySelect} />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-black px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-black rounded-full border-t-transparent"></div>
        </div>
      )}

      {weatherData && !loading && (
        <div className="space-y-8">
          {/* Current Weather */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-black">
              Current Weather {selectedCity && `in ${selectedCity.name}`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <img
                  src={getWeatherIcon(weatherData.current.weather[0].icon)}
                  alt={weatherData.current.weather[0].description}
                  className="w-16 h-16"
                />
                <div>
                  <p className="text-4xl font-bold text-black">
                    {Math.round(weatherData.current.temp)}°C
                  </p>
                  <p className="capitalize text-black">
                    {weatherData.current.weather[0].description}
                  </p>
                  <p className="text-sm text-black">
                    Feels like {Math.round(weatherData.current.feels_like)}°C
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-black">Humidity</p>
                  <p className="font-semibold text-black">{weatherData.current.humidity}%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-black">Wind Speed</p>
                  <p className="font-semibold text-black">{weatherData.current.wind_speed} m/s</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-black">Pressure</p>
                  <p className="font-semibold text-black">{weatherData.current.pressure} hPa</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-black">UV Index</p>
                  <p className="font-semibold text-black">{weatherData.current.uvi}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-black">7-Day Forecast</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={formatChartData(weatherData)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" className="text-black" />
                  <YAxis className="text-black" />
                  <Tooltip />
                  <Line type="monotone" dataKey="temperature" stroke="black" name="Temperature" />
                  <Line type="monotone" dataKey="min" stroke="gray" name="Min Temp" />
                  <Line type="monotone" dataKey="max" stroke="black" name="Max Temp" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {weatherData.daily.slice(1).map((day) => (
              <div key={day.dt} className="bg-white rounded-lg shadow-lg p-4">
                <p className="font-bold text-black">
                  {new Date(day.dt * 1000).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <div className="flex items-center justify-between">
                  <img
                    src={getWeatherIcon(day.weather[0].icon)}
                    alt={day.weather[0].description}
                    className="w-12 h-12"
                  />
                  <div className="text-right">
                    <p className="font-bold text-black">{Math.round(day.temp.max)}°C</p>
                    <p className="text-black">{Math.round(day.temp.min)}°C</p>
                  </div>
                </div>
                <p className="text-sm text-black mt-2 capitalize">{day.weather[0].description}</p>
                <div className="mt-2 pt-2 border-t">
                  <p className="text-xs text-black">{day.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
