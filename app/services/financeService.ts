import { StockQuote, StockSearchResponse, TimeSeriesResponse, TimeInterval } from '../types/finance';

function checkApiKey() {
  if (!process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY) {
    console.error('API key is missing');
    throw new Error('Alpha Vantage API key is not configured');
  }
  if (process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY === 'your_api_key_here') {
    console.error('API key is still set to placeholder');
    throw new Error('Please replace the placeholder API key in .env.local');
  }
}

export async function searchStocks(query: string): Promise<StockSearchResponse> {
  try {
    checkApiKey();
    
    console.log('Searching stocks with query:', query);
    
    const response = await fetch(`/api/finance?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}`);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Search request failed:', error);
      throw new Error(error.error || `Failed to fetch stock search results: ${response.status}`);
    }

    const data = await response.json();
    console.log('Search response:', JSON.stringify(data, null, 2));
    
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
  const response = await fetch(`/api/finance?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch stock quote');
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
  let url = `/api/finance?function=${functionName}&symbol=${encodeURIComponent(symbol)}`;
  
  if (interval !== 'daily') {
    url += `&interval=${interval}`;
  }

  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch time series data');
  }

  const data = await response.json();
  if (data['Error Message']) {
    throw new Error(data['Error Message']);
  }

  return data;
} 