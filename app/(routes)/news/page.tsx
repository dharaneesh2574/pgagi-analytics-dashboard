'use client';

import React, { useState, useEffect, useRef } from 'react';
import { NewsCategory, NewsArticle } from '../../types/news';
import { getNews, searchNews } from '../../services/newsService';
import NewsCard from '../../components/NewsCard';
import NewsModal from '../../components/NewsModal';

const CATEGORIES: NewsCategory[] = [
  'general',
  'business',
  'technology',
  'entertainment',
  'sports',
  'science',
  'health',
];

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('general');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const lastArticleRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    loadNews();
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && hasMore && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    }, options);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading]);

  useEffect(() => {
    if (lastArticleRef.current && observerRef.current) {
      observerRef.current.observe(lastArticleRef.current);
    }
  }, [articles]);

  useEffect(() => {
    if (page > 1) {
      loadMoreNews();
    }
  }, [page]);

  const loadNews = async () => {
    setLoading(true);
    setError(null);
    setPage(1);
    setArticles([]);
    setHasMore(true);

    try {
      const response = searchQuery
        ? await searchNews(searchQuery)
        : await getNews(selectedCategory);

      setArticles(response.articles);
      setHasMore(response.articles.length === 10);
    } catch (err) {
      setError('Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreNews = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = searchQuery
        ? await searchNews(searchQuery, page)
        : await getNews(selectedCategory, page);

      setArticles((prev) => [...prev, ...response.articles]);
      setHasMore(response.articles.length === 10);
    } catch (err) {
      setError('Failed to fetch more news');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search news..."
          className="w-full p-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-black text-white placeholder-gray-400 mb-4"
        />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full capitalize ${
                selectedCategory === category
                  ? 'bg-white text-black'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-white px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <div
            key={`${article.url}-${index}`}
            ref={index === articles.length - 1 ? lastArticleRef : undefined}
          >
            <NewsCard
              article={article}
              onReadMore={setSelectedArticle}
            />
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-white rounded-full border-t-transparent"></div>
        </div>
      )}

      {!loading && articles.length === 0 && (
        <div className="text-center py-8 text-gray-300">
          No articles found. Try a different category or search term.
        </div>
      )}

      <NewsModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  );
} 