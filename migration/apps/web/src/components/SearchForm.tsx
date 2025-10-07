'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AMAZON_CATEGORIES } from '@referral-site/shared';

export default function SearchForm() {
  const router = useRouter();
  const [keywords, setKeywords] = useState('');
  const [category, setCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState('');
  const [primeOnly, setPrimeOnly] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams({
      keywords,
      category,
      primeOnly: primeOnly.toString(),
      discountOnly: discountOnly.toString(),
    });

    if (maxPrice) {
      params.append('maxPrice', maxPrice);
    }

    router.push(`/results?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white dark:bg-amazon-light rounded-lg shadow-xl p-8">
      {/* Keywords */}
      <div className="mb-6">
        <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Parole chiave *
        </label>
        <input
          type="text"
          id="keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amazon-orange focus:border-transparent dark:bg-amazon-dark dark:text-white"
          placeholder="Es: laptop, cuffie wireless, kindle..."
        />
      </div>

      {/* Category and Max Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Categoria
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amazon-orange focus:border-transparent dark:bg-amazon-dark dark:text-white"
          >
            {Object.entries(AMAZON_CATEGORIES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Prezzo massimo (€)
          </label>
          <input
            type="number"
            id="maxPrice"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min="0"
            step="0.01"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amazon-orange focus:border-transparent dark:bg-amazon-dark dark:text-white"
            placeholder="Es: 500"
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap gap-6 mb-8">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={primeOnly}
            onChange={(e) => setPrimeOnly(e.target.checked)}
            className="w-5 h-5 text-amazon-orange border-gray-300 rounded focus:ring-amazon-orange"
          />
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            Solo prodotti Prime
          </span>
        </label>

        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={discountOnly}
            onChange={(e) => setDiscountOnly(e.target.checked)}
            className="w-5 h-5 text-amazon-orange border-gray-300 rounded focus:ring-amazon-orange"
          />
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            Solo prodotti in sconto
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!keywords}
        className="w-full bg-amazon-orange hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
      >
        <span>🔍</span>
        Cerca Prodotti
      </button>
    </form>
  );
}
