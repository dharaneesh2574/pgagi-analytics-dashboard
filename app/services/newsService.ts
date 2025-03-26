import { NewsCategory, NewsResponse, NewsArticle } from '../types/news';

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

function checkApiKey() {
  if (!API_KEY) {
    throw new Error('News API key is not configured. Please add NEXT_PUBLIC_NEWS_API_KEY to your .env.local file');
  }
  if (API_KEY === 'your_api_key_here') {
    throw new Error('Please replace the placeholder API key in .env.local with your actual News API key');
  }
}

export async function getNews(
  category: NewsCategory = 'general',
  page: number = 1,
  pageSize: number = 10
): Promise<NewsResponse> {
  checkApiKey();

  const response = await fetch(
    `${BASE_URL}/top-headlines?country=us&category=${category}&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`
  );

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your News API key in .env.local');
    }
    throw new Error(error.message || 'Failed to fetch news');
  }

  return response.json();
}

export async function searchNews(
  category: string = 'general',
  query: string = '',
  page: number = 1,
  pageSize: number = 10
): Promise<{ articles: NewsArticle[]; totalResults: number }> {
  try {
    const searchParams = new URLSearchParams({
      category,
      q: query,
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    const response = await fetch(`/api/news?${searchParams.toString()}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch news');
    }

    const data = await response.json();
    return {
      articles: data.articles,
      totalResults: data.totalResults,
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
} 