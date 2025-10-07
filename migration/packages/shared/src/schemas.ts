import { z } from 'zod';

// Search request schema
export const searchRequestSchema = z.object({
  keywords: z.string().min(1, 'Keywords are required'),
  maxPrice: z.number().positive().optional(),
  category: z.enum([
    'All',
    'Electronics',
    'Computers',
    'VideoGames',
    'OfficeProducts',
    'Furniture',
    'HomeAndKitchen',
    'Sports',
    'ToysAndGames',
  ]).default('All'),
  primeOnly: z.boolean().default(false),
  discountOnly: z.boolean().default(false),
  itemCount: z.number().min(1).max(10).default(10),
});

export type SearchRequest = z.infer<typeof searchRequestSchema>;

// Product price schema
export const priceSchema = z.object({
  current: z.number(),
  currentFormatted: z.string(),
  original: z.number().nullable(),
  originalFormatted: z.string().nullable(),
  discountPercent: z.number().nullable(),
});

export type Price = z.infer<typeof priceSchema>;

// Product rating schema
export const ratingSchema = z.object({
  stars: z.number().min(0).max(5),
  count: z.number().min(0),
});

export type Rating = z.infer<typeof ratingSchema>;

// Product schema
export const productSchema = z.object({
  asin: z.string(),
  title: z.string(),
  url: z.string().url(),
  imageUrl: z.string().url().nullable(),
  brand: z.string().nullable(),
  price: priceSchema,
  isPrime: z.boolean(),
  rating: ratingSchema.nullable(),
  features: z.array(z.string()).default([]),
});

export type Product = z.infer<typeof productSchema>;

// Search response schema
export const searchResponseSchema = z.object({
  products: z.array(productSchema),
  count: z.number(),
  error: z.string().nullable(),
});

export type SearchResponse = z.infer<typeof searchResponseSchema>;

// API error response schema
export const errorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.number(),
  timestamp: z.string(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

// Health check response
export const healthCheckSchema = z.object({
  status: z.enum(['ok', 'error']),
  timestamp: z.string(),
  uptime: z.number(),
  version: z.string().optional(),
});

export type HealthCheck = z.infer<typeof healthCheckSchema>;
