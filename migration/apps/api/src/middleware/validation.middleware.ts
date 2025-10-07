import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          message: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
      }
      next(error);
    }
  };
};
