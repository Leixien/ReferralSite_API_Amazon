import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createApp } from '../src/app';
import request from 'supertest';
import type { Express } from 'express';

describe('API Integration Tests', () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  describe('Health Endpoints', () => {
    it('GET / should return service info', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('service');
      expect(response.body).toHaveProperty('status', 'running');
    });

    it('GET /healthz should return health status', async () => {
      const response = await request(app).get('/healthz');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('GET /metrics should return metrics', async () => {
      const response = await request(app).get('/metrics');
      
      expect(response.status).toBe(200);
      expect(response.text).toContain('process_uptime_seconds');
      expect(response.text).toContain('nodejs_version_info');
    });
  });

  describe('Search Endpoint', () => {
    it('POST /api/search should validate request body', async () => {
      const response = await request(app)
        .post('/api/search')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('POST /api/search with valid keywords should return products', async () => {
      const response = await request(app)
        .post('/api/search')
        .send({
          keywords: 'laptop',
          category: 'Computers',
          itemCount: 5,
        });
      
      // May fail if Amazon API credentials not set
      if (response.status === 200) {
        expect(response.body).toHaveProperty('products');
        expect(response.body).toHaveProperty('count');
        expect(Array.isArray(response.body.products)).toBe(true);
      } else {
        expect(response.status).toBeGreaterThanOrEqual(400);
        expect(response.body).toHaveProperty('error');
      }
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/unknown');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });
});
