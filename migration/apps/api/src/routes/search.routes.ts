import { Router } from 'express';
import type { SearchResponse } from '@referral-site/shared';
import { searchRequestSchema } from '@referral-site/shared';
import { amazonService } from '@/services/amazon.service';
import { parserService } from '@/services/parser.service';
import { cacheService } from '@/services/cache.service';
import { AppError } from '@/middleware/error.middleware';
import { logger } from '@/config/logger';
import crypto from 'crypto';

const router = Router();

/**
 * POST /api/search
 * Search for Amazon products
 */
router.post('/', async (req, res, next) => {
  try {
    // Validate request
    const params = searchRequestSchema.parse(req.body);

    // Generate cache key
    const cacheKey = `search:${crypto
      .createHash('md5')
      .update(JSON.stringify(params))
      .digest('hex')}`;

    // Check cache
    const cached = cacheService.get<SearchResponse>(cacheKey);
    if (cached) {
      logger.info({ cacheKey }, 'Returning cached results');
      return res.json(cached);
    }

    // Search Amazon
    const amazonResponse = await amazonService.searchItems({
      keywords: params.keywords,
      maxPrice: params.maxPrice,
      category: params.category,
      itemCount: params.itemCount,
      primeOnly: params.primeOnly,
      discountOnly: params.discountOnly,
    });

    // Check for errors
    if (amazonResponse.Errors && amazonResponse.Errors.length > 0) {
      const error = amazonResponse.Errors[0];
      throw new AppError(400, error.Message || 'Amazon API error');
    }

    // Parse products
    const items = amazonResponse.SearchResult?.Items || [];
    let products = parserService.parseProducts(items);

    // Apply additional filters (some filters may not be supported by Amazon API)
    products = parserService.filterProducts(products, {
      primeOnly: params.primeOnly,
      discountOnly: params.discountOnly,
      maxPrice: params.maxPrice,
    });

    const response: SearchResponse = {
      products,
      count: products.length,
      error: null,
    };

    // Cache results
    cacheService.set(cacheKey, response);

    logger.info({ count: products.length, keywords: params.keywords }, 'Search completed');

    res.json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/search/cache/flush
 * Flush search cache (dev only)
 */
router.get('/cache/flush', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Cache flush not allowed in production',
      statusCode: 403,
      timestamp: new Date().toISOString(),
    });
  }

  cacheService.flush();
  logger.info('Cache flushed');

  res.json({ message: 'Cache flushed successfully' });
});

export default router;
