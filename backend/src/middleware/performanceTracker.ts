import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { performance } from 'perf_hooks';

export const logApiPerformance = (req: Request, res: Response, next: NextFunction) => {
  const startTime = performance.now();

  // Listen to the finish event on the response to log the performance
  res.on('finish', async () => {
    const responseTime = Math.round(performance.now() - startTime);
    const success = res.statusCode >= 200 && res.statusCode < 400;

    // Log the request details to the database
    try {
      await prisma.apiPerformance.create({
        data: {
          endpoint: req.originalUrl,
          method: req.method,
          success,
          statusCode: res.statusCode,
          responseTime,
        },
      });
    } catch (error) {
      console.error('Failed to log API performance:', error);
    }
  });

  next();
};
