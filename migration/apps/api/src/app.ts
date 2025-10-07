import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { config } from '@/config';
import { logger } from '@/config/logger';
import routes from '@/routes';
import { errorHandler, notFoundHandler } from '@/middleware/error.middleware';

export const createApp = (): Express => {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
  }));

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging
  app.use(pinoHttp({ logger }));

  // API routes
  app.use('/api', routes);

  // Health check at root
  app.get('/', (req, res) => {
    res.json({
      service: 'Amazon Affiliate Finder API',
      status: 'running',
      version: process.env.npm_package_version || '1.0.0',
    });
  });

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
