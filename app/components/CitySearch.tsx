import React, { useState, useEffect } from 'react';
import { City } from '../types/weather';
import { searchCities } from '../services/weatherService';

interface CitySearchProps {
  onCitySelect: (city: City) => void;
}

export default function CitySearch({ onCitySelect }: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length >= 3) {
        setIsLoading(true);
        try {
          const results = await searchCities(query);
          setCities(results);
        } catch (error) {
          console.error('Error searching cities:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setCities([]);
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a city..."
        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      
      {isLoading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      )}

      {cities.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {cities.map((city, index) => (
            <li
              key={`${city.lat}-${city.lon}-${index}`}
              className="p-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onCitySelect(city);
                setQuery('');
                setCities([]);
              }}
            >
              {city.name}, {city.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 