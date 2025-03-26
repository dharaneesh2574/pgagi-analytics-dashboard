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
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {article.urlToImage && (
        <img
          src={article.urlToImage}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">{article.source.name}</span>
          <span className="text-sm text-gray-500">{formatDate(article.publishedAt)}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 text-black">{article.title}</h3>
        {article.description && (
          <p className="text-gray-600 mb-4">{article.description}</p>
        )}
        <div className="flex justify-between items-center">
          {article.author && (
            <span className="text-sm text-gray-500">By {article.author}</span>
          )}
          <button
            onClick={() => onReadMore(article)}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
} 