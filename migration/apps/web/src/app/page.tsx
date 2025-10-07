import SearchForm from '@/components/SearchForm';
import { Header } from '@/components/Header';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-amazon-dark">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amazon-dark dark:text-white mb-4">
            Amazon Prime Day Affiliate Finder
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Trova le migliori offerte del Prime Day e genera link affiliati automaticamente
          </p>
        </div>

        <SearchForm />
      </div>
    </main>
  );
}
