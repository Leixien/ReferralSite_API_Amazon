import { z } from 'zod';

const configSchema = z.object({
  // Server
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.number().default(5000),
  
  // Amazon API
  amazon: z.object({
    accessKey: z.string().min(1, 'AWS_ACCESS_KEY is required'),
    secretKey: z.string().min(1, 'AWS_SECRET_KEY is required'),
    associateTag: z.string().min(1, 'AMAZON_ASSOCIATE_TAG is required'),
    region: z.string().default('eu-west-1'),
    marketplace: z.string().default('www.amazon.it'),
  }),
  
  // Security
  secretKey: z.string().default('dev-secret-key'),
  corsOrigin: z.string().default('*'),
  
  // Cache
  cache: z.object({
    ttl: z.number().default(300), // 5 minutes
    type: z.enum(['memory', 'redis']).default('memory'),
  }),
  
  // Logging
  logLevel: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

export type Config = z.infer<typeof configSchema>;

export const loadConfig = (): Config => {
  const raw = {
    nodeEnv: process.env.NODE_ENV as 'development' | 'production' | 'test',
    port: parseInt(process.env.PORT || '5000', 10),
    amazon: {
      accessKey: process.env.AWS_ACCESS_KEY || '',
      secretKey: process.env.AWS_SECRET_KEY || '',
      associateTag: process.env.AMAZON_ASSOCIATE_TAG || '',
      region: process.env.AMAZON_REGION || 'eu-west-1',
      marketplace: process.env.AMAZON_MARKETPLACE || 'www.amazon.it',
    },
    secretKey: process.env.SECRET_KEY || 'dev-secret-key',
    corsOrigin: process.env.CORS_ORIGIN || '*',
    cache: {
      ttl: parseInt(process.env.CACHE_TTL || '300', 10),
      type: (process.env.CACHE_TYPE || 'memory') as 'memory' | 'redis',
    },
    logLevel: (process.env.LOG_LEVEL || 'info') as 'info',
  };

  return configSchema.parse(raw);
};

export const config = loadConfig();
