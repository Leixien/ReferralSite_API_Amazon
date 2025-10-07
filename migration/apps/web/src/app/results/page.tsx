'use client';

import { useSearchParams } from 'next/navigation';
import { SearchResults } from '@/components/SearchResults';
import { Header } from '@/components/Header';
import { useSearch } from '@/hooks/useSearch';
import { Suspense } from 'react';

function ResultsContent() {
  const searchParams = useSearchParams();
  
  const keywords = searchParams.get('keywords') || '';
  const category = searchParams.get('category') || 'All';
  const maxPrice = searchParams.get('maxPrice');
  const primeOnly = searchParams.get('primeOnly') === 'true';
  const discountOnly = searchParams.get('discountOnly') === 'true';

  const { data, error, isLoading } = useSearch({
    keywords,
    category,
    maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
    primeOnly,
    discountOnly,
  });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-amazon-dark">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-amazon-dark dark:text-white mb-2">
            Risultati per "{keywords}"
          </h1>
          {data && (
            <p className="text-gray-600 dark:text-gray-300">
              {data.count} prodotti trovati
            </p>
          )}
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amazon-orange"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded">
            <p className="font-bold">Errore</p>
            <p>{error.message || 'Si è verificato un errore durante la ricerca'}</p>
          </div>
        )}

        {data && !error && !isLoading && (
          <SearchResults products={data.products} />
        )}
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
