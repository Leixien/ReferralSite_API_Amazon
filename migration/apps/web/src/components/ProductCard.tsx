'use client';

import Image from 'next/image';
import type { Product } from '@referral-site/shared';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white dark:bg-amazon-light rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-64 bg-gray-100 dark:bg-amazon-dark">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-6xl">
            📦
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {product.isPrime && (
            <span className="bg-prime-blue text-white text-xs font-bold px-2 py-1 rounded">
              Prime
            </span>
          )}
          {product.price.discountPercent && product.price.discountPercent > 0 && (
            <span className="bg-discount-red text-white text-xs font-bold px-2 py-1 rounded">
              -{product.price.discountPercent}%
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{product.brand}</p>
        )}

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2 mb-2 min-h-[40px]">
          {product.title}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i}>
                  {i < Math.floor(product.rating!.stars) ? '★' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              ({product.rating.count})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mb-4 mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-price-red">
              {product.price.currentFormatted}
            </span>
          </div>
          {product.price.original && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 line-through">
                {product.price.originalFormatted}
              </span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-amazon-orange hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg text-center transition duration-200"
        >
          Vedi su Amazon
        </a>
      </div>
    </div>
  );
}
