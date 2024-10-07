import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

/**
 * Retrieve API performance logs with optional date range filtering
 */
export const getApiPerformance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;

    // Default date range (last 7 days) if no parameters are provided
    let start = new Date();
    start.setDate(start.getDate() - 7); // Default to the last 7 days

    let end = new Date(); // Default to today

    if (startDate) {
      start = new Date(startDate as string);
    }

    if (endDate) {
      end = new Date(endDate as string);
    }

    // Query the performance logs within the specified date range
    const performanceLogs = await prisma.apiPerformance.findMany({
      where: {
        createdAt: {
          gte: start, // Greater than or equal to start date
          lte: end, // Less than or equal to end date
        },
      },
    });

    res.status(200).json({
      totalRequests: performanceLogs.length,
      successfulRequests: performanceLogs.filter((log) => log.success).length,
      failedRequests: performanceLogs.filter((log) => !log.success).length,
      performanceLogs,
    });
  } catch (error) {
    next(error);
  }
};
