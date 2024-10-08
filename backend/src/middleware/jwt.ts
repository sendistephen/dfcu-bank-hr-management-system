import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/customErrors';
import express from 'express';
import { CustomRequest } from 'types/express';

interface JwtPayloadCustom extends jwt.JwtPayload {
  id: number;
  role: string;
}

/**
 * @description Middleware to verify the JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

export const verifyToken = (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  try {
    const authHeader = req.get('authorization');

    if (!authHeader || Array.isArray(authHeader)) {
      throw new UnauthorizedError('Authorization header not provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Bearer token not provided');
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET as string) as JwtPayloadCustom;

    // Attach user info to the request object
    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Token has expired'));
    } else {
      next(error);
    }
  }
};
