import type { Product, AmazonItem } from '@referral-site/shared';
import { amazonService } from './amazon.service';
import { logger } from '@/config/logger';

export class ParserService {
  /**
   * Parse Amazon API item to our Product type
   */
  parseProduct(item: AmazonItem): Product | null {
    try {
      const asin = item.ASIN;
      if (!asin) {
        logger.warn({ item }, 'Missing ASIN in Amazon item');
        return null;
      }

      const title = item.ItemInfo?.Title?.DisplayValue || 'N/A';
      const brand = item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue || null;
      const imageUrl = item.Images?.Primary?.Large?.URL || null;
      const features = item.ItemInfo?.Features?.DisplayValues || [];

      // Parse price
      const listing = item.Offers?.Listings?.[0];
      const currentPrice = listing?.Price?.Amount || 0;
      const currentPriceFormatted = listing?.Price?.DisplayAmount || '€0.00';
      const originalPrice = listing?.SavingBasis?.Amount || null;
      const originalPriceFormatted = listing?.SavingBasis?.DisplayAmount || null;

      let discountPercent: number | null = null;
      if (originalPrice && currentPrice && originalPrice > currentPrice) {
        discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
      }

      // Parse rating
      const starRating = item.CustomerReviews?.StarRating?.Value || null;
      const reviewCount = item.CustomerReviews?.Count || 0;

      const rating = starRating
        ? {
            stars: starRating,
            count: reviewCount,
          }
        : null;

      // Check Prime eligibility
      const isPrime = listing?.ProgramEligibility?.IsPrimeExclusive || false;

      // Generate affiliate URL
      const url = amazonService.generateAffiliateLink(asin);

      return {
        asin,
        title,
        url,
        imageUrl,
        brand,
        price: {
          current: currentPrice,
          currentFormatted: currentPriceFormatted,
          original: originalPrice,
          originalFormatted: originalPriceFormatted,
          discountPercent,
        },
        isPrime,
        rating,
        features,
      };
    } catch (error) {
      logger.error({ error, item }, 'Failed to parse product');
      return null;
    }
  }

  /**
   * Parse multiple Amazon items
   */
  parseProducts(items: AmazonItem[]): Product[] {
    return items
      .map((item) => this.parseProduct(item))
      .filter((product): product is Product => product !== null);
  }

  /**
   * Apply filters to products
   */
  filterProducts(
    products: Product[],
    filters: {
      primeOnly?: boolean;
      discountOnly?: boolean;
      maxPrice?: number;
    }
  ): Product[] {
    let filtered = [...products];

    if (filters.primeOnly) {
      filtered = filtered.filter((p) => p.isPrime);
    }

    if (filters.discountOnly) {
      filtered = filtered.filter((p) => p.price.discountPercent && p.price.discountPercent > 0);
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((p) => p.price.current <= filters.maxPrice!);
    }

    return filtered;
  }

  /**
   * Sort products
   */
  sortProducts(
    products: Product[],
    sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'discount' | 'rating' = 'relevance'
  ): Product[] {
    const sorted = [...products];

    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price.current - b.price.current);
      
      case 'price-desc':
        return sorted.sort((a, b) => b.price.current - a.price.current);
      
      case 'discount':
        return sorted.sort((a, b) => {
          const discountA = a.price.discountPercent || 0;
          const discountB = b.price.discountPercent || 0;
          return discountB - discountA;
        });
      
      case 'rating':
        return sorted.sort((a, b) => {
          const ratingA = a.rating?.stars || 0;
          const ratingB = b.rating?.stars || 0;
          return ratingB - ratingA;
        });
      
      case 'relevance':
      default:
        return sorted; // Keep original order from Amazon
    }
  }
}

export const parserService = new ParserService();
