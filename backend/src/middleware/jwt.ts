import express from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/customErrors';

declare module 'express' {
  export interface Request {
    userId?: string;
    userRole?: string;
  }
}

/**
 * @description Middleware to verify the JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const verifyToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // Get user token from the cookie
    const token = req.cookies.accessToken;

    if (!token) throw new UnauthorizedError('You are not authorized to access this resource');

    // verify and decode the token
    const payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET as string) as jwt.JwtPayload & {
      id: string;
      role: string;
    };

    if (!payload || typeof payload !== 'object' || !payload.id || !payload.role) {
      throw new UnauthorizedError('Invalid token or token payload');
    }

    // Set the user in the request object
    req.userId = payload.id;
    req.userRole = payload.role;

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
