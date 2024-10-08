import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { UnauthorizedError } from '../utils/customErrors';
import { CustomRequest } from 'types/express';

const prisma = new PrismaClient();

export const authMiddleware = async (req: CustomRequest, res: express.Response, next: express.NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided, authorization denied!');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET as string) as jwt.JwtPayload;

    const user = await prisma.user.findUnique({ where: { id: Number(decoded.id) } });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    req.userId = user.id;
    req.userRole = user.role;

    next();
  } catch (error) {
    next(error);
  }
};
