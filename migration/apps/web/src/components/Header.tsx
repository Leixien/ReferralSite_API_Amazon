'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-amazon-dark text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold hover:text-amazon-orange transition">
          🔍 Amazon Finder
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className="hover:text-amazon-orange transition">
            Home
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-amazon-light transition"
            aria-label="Toggle dark mode"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </nav>
      </div>
    </header>
  );
}
