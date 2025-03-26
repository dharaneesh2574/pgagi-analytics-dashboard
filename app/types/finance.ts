export interface StockQuote {
  '01. symbol': string;
  '02. open': string;
  '03. high': string;
  '04. low': string;
  '05. price': string;
  '06. volume': string;
  '07. latest trading day': string;
  '08. previous close': string;
  '09. change': string;
  '10. change percent': string;
}

export interface TimeSeriesData {
  '1. open': string;
  '2. high': string;
  '3. low': string;
  '4. close': string;
  '5. volume': string;
}

export interface StockSearchResult {
  '1. symbol': string;
  '2. name': string;
  '3. type': string;
  '4. region': string;
  '5. marketOpen': string;
  '6. marketClose': string;
  '7. timezone': string;
  '8. currency': string;
  '9. matchScore': string;
}

export interface StockSearchResponse {
  bestMatches: StockSearchResult[];
}

export interface TimeSeriesResponse {
  'Time Series (Daily)': {
    [date: string]: TimeSeriesData;
  };
  'Time Series (1min)': {
    [date: string]: TimeSeriesData;
  };
  'Time Series (5min)': {
    [date: string]: TimeSeriesData;
  };
  'Time Series (15min)': {
    [date: string]: TimeSeriesData;
  };
  'Time Series (30min)': {
    [date: string]: TimeSeriesData;
  };
  'Time Series (60min)': {
    [date: string]: TimeSeriesData;
  };
}

export type TimeInterval = '1min' | '5min' | '15min' | '30min' | '60min' | 'daily'; 