import { NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const query = searchParams.get('q');
  const page = searchParams.get('page') || '1';
  const pageSize = searchParams.get('pageSize') || '10';

  if (!API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    let url = `${BASE_URL}/top-headlines?country=us&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    
    if (category && category !== 'general') {
      url += `&category=${category}`;
    }
    
    if (query) {
      url = `${BASE_URL}/everything?q=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'error') {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news data' },
      { status: 500 }
    );
  }
} 