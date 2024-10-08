import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import { AppError, NotFoundError } from '../utils/customErrors';

interface JwtPayloadCustom extends jwt.JwtPayload {
  id: number;
  role?: string;
}

class AuthService {
  // Generate access token
  private static generateAccessToken(userId: string | number, userRole: string) {
    return jwt.sign({ id: userId, role: userRole }, process.env.JWT_ACCESS_TOKEN_SECRET as string, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY || '15d',
    });
  }

  // Generate refresh token
  private static generateRefreshToken(userId: string | number) {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_TOKEN_SECRET as string, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d',
    });
  }

  public static async login(email: string, password: string) {
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    // Find the user by email
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    // Update user with new refresh token
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

    const userInfo = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken,
      refreshToken,
      user: userInfo,
    };
  }

  public static async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new AppError('Refresh token not provided', 401);
    }

    try {
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET as string) as JwtPayloadCustom;

      // Check if id exists and convert it if needed (if your user id is numeric)
      const userId = Number(decoded.id);

      if (isNaN(userId)) {
        throw new AppError('Invalid token payload: user id is not valid', 401);
      }

      // Find user with the refreshToken
      const user = await prisma.user.findFirst({
        where: { id: userId, refreshToken },
      });

      if (!user) {
        throw new NotFoundError('Invalid refresh token');
      }

      // Generate new access token
      const newAccessToken = this.generateAccessToken(user.id, user.role);

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      // Handle JWT specific errors
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid token', 401);
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Token expired', 401);
      }
      throw error;
    }
  }

  public static async logout(refreshToken: string) {
    if (!refreshToken) {
      throw new AppError('Refresh token not provided', 401);
    }

    // Invalidate the refresh token
    const result = await prisma.user.updateMany({
      where: { refreshToken },
      data: { refreshToken: '' },
    });

    if (result.count === 0) {
      throw new NotFoundError('Invalid refresh token');
    }

    return { message: 'Logged out successfully' };
  }
}

export default AuthService;
