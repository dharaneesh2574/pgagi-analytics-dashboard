'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { StockQuote, StockSearchResult, TimeSeriesResponse, TimeInterval } from '../../types/finance';
import { searchStocks, getStockQuote, getTimeSeriesData } from '../../services/financeService';
import StockChart from '../../components/StockChart';

export default function FinancePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockSearchResult | null>(null);
  const [stockQuote, setStockQuote] = useState<StockQuote | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesResponse | null>(null);
  const [timeInterval, setTimeInterval] = useState<TimeInterval>('daily');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    setError(null);
    
    try {
      console.log('Starting search for:', query);
      const response = await searchStocks(query);
      console.log('Search response received:', response);
      
      if (Array.isArray(response.bestMatches)) {
        setSearchResults(response.bestMatches);
      } else {
        console.warn('Invalid response format:', response);
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Failed to search stocks');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      performSearch(searchQuery);
    }, 500); // Increased debounce time to 500ms

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, performSearch]);

  useEffect(() => {
    if (selectedStock) {
      loadStockData();
    }
  }, [selectedStock, timeInterval]);

  const loadStockData = async () => {
    if (!selectedStock) return;

    setLoading(true);
    setError(null);

    try {
      const [quote, timeSeries] = await Promise.all([
        getStockQuote(selectedStock['1. symbol']),
        getTimeSeriesData(selectedStock['1. symbol'], timeInterval),
      ]);

      setStockQuote(quote);
      setTimeSeriesData(timeSeries);
    } catch (err) {
      setError('Failed to load stock data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a stock symbol (e.g., AAPL, MSFT)..."
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchLoading && (
            <div className="absolute right-3 top-3">
              <div className="animate-spin h-5 w-5 border-2 border-black rounded-full border-t-transparent"></div>
            </div>
          )}
          {error && (
            <div className="absolute left-0 right-0 mt-1 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {Array.isArray(searchResults) && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto">
              {searchResults.map((result) => (
                <button
                  key={result['1. symbol']}
                  onClick={() => {
                    setSelectedStock(result);
                    setSearchQuery(result['1. symbol']);
                    setSearchResults([]);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  {result['1. symbol']} - {result['2. name']}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedStock && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4">
            {['1min', '5min', '15min', '30min', '60min', 'daily'].map((interval) => (
              <button
                key={interval}
                onClick={() => setTimeInterval(interval as TimeInterval)}
                className={`px-4 py-2 rounded-full capitalize ${
                  timeInterval === interval
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {interval}
              </button>
            ))}
          </div>

          {stockQuote && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm text-gray-500">Current Price</h3>
                <p className="text-2xl font-bold">${parseFloat(stockQuote['05. price']).toFixed(2)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm text-gray-500">Change</h3>
                <p className={`text-2xl font-bold ${
                  parseFloat(stockQuote['09. change']) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stockQuote['09. change']} ({stockQuote['10. change percent']})
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm text-gray-500">High</h3>
                <p className="text-2xl font-bold">${parseFloat(stockQuote['03. high']).toFixed(2)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm text-gray-500">Low</h3>
                <p className="text-2xl font-bold">${parseFloat(stockQuote['04. low']).toFixed(2)}</p>
              </div>
            </div>
          )}

          {timeSeriesData && (
            <StockChart
              data={timeSeriesData[`Time Series (${timeInterval === 'daily' ? 'Daily' : timeInterval})`] ?? null}
              title={`${selectedStock['1. symbol']} Stock Price`}
            />
          )}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-black rounded-full border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}