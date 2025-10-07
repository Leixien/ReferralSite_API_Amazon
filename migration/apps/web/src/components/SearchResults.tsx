'use client';

import { useState } from 'react';
import type { Product } from '@referral-site/shared';
import { ProductCard } from './ProductCard';

interface SearchResultsProps {
  products: Product[];
}

export function SearchResults({ products }: SearchResultsProps) {
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'discount' | 'rating'>('relevance');

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price.current - b.price.current;
      case 'price-desc':
        return b.price.current - a.price.current;
      case 'discount':
        return (b.price.discountPercent || 0) - (a.price.discountPercent || 0);
      case 'rating':
        return (b.rating?.stars || 0) - (a.rating?.stars || 0);
      default:
        return 0;
    }
  });

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
          Nessun risultato trovato
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Prova a modificare i termini di ricerca o i filtri
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Sort Controls */}
      <div className="mb-6 flex items-center justify-between">
        <label htmlFor="sort" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Ordina per:
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amazon-orange dark:bg-amazon-light dark:text-white"
        >
          <option value="relevance">Rilevanza</option>
          <option value="price-asc">Prezzo: crescente</option>
          <option value="price-desc">Prezzo: decrescente</option>
          <option value="discount">Sconto</option>
          <option value="rating">Valutazione</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <ProductCard key={product.asin} product={product} />
        ))}
      </div>
    </div>
  );
}
