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
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{article.title}</h2>
              <div className="flex items-center space-x-4 text-gray-300">
                <span>{article.source.name}</span>
                <span>•</span>
                <span>{formatDate(article.publishedAt)}</span>
                {article.author && (
                  <>
                    <span>•</span>
                    <span>By {article.author}</span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {article.urlToImage && (
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}

          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-4">{article.description}</p>
            <p className="text-gray-300">{article.content}</p>
          </div>

          <div className="mt-6 flex justify-end">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Read Full Article
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 