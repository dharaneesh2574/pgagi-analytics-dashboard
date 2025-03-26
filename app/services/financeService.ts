import { StockQuote, StockSearchResponse, TimeSeriesResponse, TimeInterval } from '../types/finance';

const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

function checkApiKey() {
  if (!API_KEY) {
    console.error('API key is missing');
    throw new Error('Alpha Vantage API key is not configured');
  }
  if (API_KEY === 'your_api_key_here') {
    console.error('API key is still set to placeholder');
    throw new Error('Please replace the placeholder API key in .env.local');
  }
}

export async function searchStocks(query: string): Promise<StockSearchResponse> {
  try {
    checkApiKey();
    
    console.log('Searching stocks with query:', query);
    console.log('Using API key:', API_KEY?.substring(0, 4) + '...');
    
    const url = `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${API_KEY}`;
    console.log('Request URL:', url);
    
    const response = await fetch(url);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      console.error('Search request failed:', response.status, response.statusText);
      throw new Error(`Failed to fetch stock search results: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Search response:', JSON.stringify(data, null, 2));
    
    if (data['Error Message']) {
      console.error('API returned error:', data['Error Message']);
      throw new Error(data['Error Message']);
    }

    if (data['Note']) {
      console.warn('API returned note:', data['Note']);
    }

    if (!data.bestMatches) {
      console.warn('No bestMatches in response:', data);
      return { bestMatches: [] };
    }

    return data;
  } catch (error) {
    console.error('Error in searchStocks:', error);
    throw error;
  }
}

export async function getStockQuote(symbol: string): Promise<StockQuote> {
  checkApiKey();
  const response = await fetch(
    `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch stock quote');
  }

  const data = await response.json();
  if (data['Error Message']) {
    throw new Error(data['Error Message']);
  }

  return data['Global Quote'];
}

export async function getTimeSeriesData(
  symbol: string,
  interval: TimeInterval = 'daily'
): Promise<TimeSeriesResponse> {
  checkApiKey();
  const functionName = interval === 'daily' ? 'TIME_SERIES_DAILY' : 'TIME_SERIES_INTRADAY';
  let url = `${BASE_URL}?function=${functionName}&symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`;
  
  if (interval !== 'daily') {
    url += `&interval=${interval}`;
  }

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch time series data');
  }

  const data = await response.json();
  if (data['Error Message']) {
    throw new Error(data['Error Message']);
  }

  return data;
} 