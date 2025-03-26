'use client';

import React from 'react';
import { NewsArticle } from '../types/news';
import { formatDate } from '../services/newsService';

interface NewsModalProps {
  article: NewsArticle | null;
  onClose: () => void;
}

export default function NewsModal({ article, onClose }: NewsModalProps) {
  if (!article) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {article.urlToImage && (
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">{article.source.name}</span>
            <span className="text-sm text-gray-500">{formatDate(article.publishedAt)}</span>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-black">{article.title}</h2>
          {article.author && (
            <p className="text-sm text-gray-500 mb-4">By {article.author}</p>
          )}
          {article.description && (
            <p className="text-lg text-gray-600 mb-6">{article.description}</p>
          )}
          {article.content && (
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700">{article.content}</p>
            </div>
          )}
          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              Read Full Article
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 