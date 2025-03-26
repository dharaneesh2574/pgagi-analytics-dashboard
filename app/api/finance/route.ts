import { NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const function_name = searchParams.get('function');
  const symbol = searchParams.get('symbol');
  const keywords = searchParams.get('keywords');
  const interval = searchParams.get('interval');

  if (!API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    let url = `${BASE_URL}?function=${function_name}&apikey=${API_KEY}`;
    
    if (symbol) url += `&symbol=${encodeURIComponent(symbol)}`;
    if (keywords) url += `&keywords=${encodeURIComponent(keywords)}`;
    if (interval) url += `&interval=${interval}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data['Error Message']) {
      return NextResponse.json({ error: data['Error Message'] }, { status: 400 });
    }

    if (data['Note']) {
      console.warn('API returned note:', data['Note']);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Alpha Vantage' },
      { status: 500 }
    );
  }
} 