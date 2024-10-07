import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { UnauthorizedError } from '../utils/customErrors';

const prisma = new PrismaClient();

/**
 * Middleware to authenticate and authorize admin users
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 * @throws {UnauthorizedError} If there is no token in the cookies or the token is invalid
 * @throws {UnauthorizedError} If the user is not an admin
 * @returns {Promise<void>}
 */
export const adminAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const token = req.cookies.accessToken; // get access token from cookies

    if (!token) {
      throw new UnauthorizedError('No token provided, authorization denied!');
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET as string) as jwt.JwtPayload;

    const user = await prisma.user.findUnique({ where: { id: Number(decoded.id) } });

    if (!user || user.role !== 'ADMIN') {
      throw new UnauthorizedError('You are not authorized to perform this action');
    }

    // Attach admin to the request object for further use
    req.userId = user.id.toString();
    next();
  } catch (error) {
    next(error);
  }
};
