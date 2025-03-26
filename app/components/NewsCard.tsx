'use client';

import React from 'react';
import { NewsArticle } from '../types/news';
import { formatDate } from '../services/newsService';

interface NewsCardProps {
  article: NewsArticle;
  onReadMore: (article: NewsArticle) => void;
}

export default function NewsCard({ article, onReadMore }: NewsCardProps) {
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {article.urlToImage && (
        <img
          src={article.urlToImage}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">{article.source.name}</span>
          <span className="text-sm text-gray-300">{formatDate(article.publishedAt)}</span>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-white">{article.title}</h3>
        {article.description && (
          <p className="text-gray-300 mb-4">{article.description}</p>
        )}
        {article.author && (
          <p className="text-sm text-gray-400 mb-4">By {article.author}</p>
        )}
        <button
          onClick={() => onReadMore(article)}
          className="w-full bg-white text-black py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Read More
        </button>
      </div>
    </div>
  );
} 