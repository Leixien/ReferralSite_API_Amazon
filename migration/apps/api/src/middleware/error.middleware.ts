import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '@/config/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error({ err, path: req.path, method: req.method }, 'Error occurred');

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      statusCode: 400,
      timestamp: new Date().toISOString(),
    });
  }

  // Handle operational errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      message: err.message,
      statusCode: err.statusCode,
      timestamp: new Date().toISOString(),
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message,
    statusCode: 500,
    timestamp: new Date().toISOString(),
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    statusCode: 404,
    timestamp: new Date().toISOString(),
  });
};
