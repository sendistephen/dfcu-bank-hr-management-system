import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import express from 'express';
import jwt from 'jsonwebtoken';
import { AppError, NotFoundError } from '../utils/customErrors';
import { Login } from 'types/auth';

export const login = async (req: express.Request<object, object, Login>, res: express.Response, next: express.NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Ensure email or password is provided
    if (!email && !password) throw new AppError('Email or password is required', 400);

    // Find the user by email
    const user = await prisma.user.findFirst({
      where: { email },
    });

    // If the user is not found, return a 404 error
    if (!user) throw new NotFoundError('User not found');

    // Compare the provided password with the hashed password
    const isMatch = bcrypt.compareSync(password, user.password);

    // If the password does not match, return a 401 error
    if (!isMatch) throw new AppError('Invalid credentials', 401);

    // Generate a JWT tokenand refresh token
    const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_ACCESS_TOKEN_SECRET as string, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY || '15m',
    });

    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_TOKEN_SECRET as string, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d',
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, refreshToken: __, ...userInfo } = user;

    // Set both accessToken and refreshToken as HttpOnly cookies
    res
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict', // Prevent CSRF attacks
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
      .status(200)
      .json({
        success: true,
        message: 'Login successful',
        user: userInfo,
      });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) throw new AppError('Refresh token not provided', 401);

    const user = await prisma.user.findFirst({ where: { refreshToken } });

    if (!user) throw new NotFoundError('Invalid refresh token');

    const account = user || user;

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET as string,
      ((err: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | undefined) => {
        if (err) {
          return next(new AppError('Invalid refresh token', 403));
        }

        if (decoded) {
          // Generate new access token
          const accessToken = jwt.sign({ id: account?.id, role: account?.role }, process.env.JWT_ACCESS_TOKEN_SECRET as string, {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY,
          });

          // Send the new access token as a cookie
          res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
          });

          return res.status(200).json({ message: 'Token refreshed' });
        }

        // Handle other cases
        return next(new AppError('Something went wrong', 500));
      }) as jwt.VerifyCallback
    );
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new AppError('Refresh token not provided', 401);
    }

    const user = await prisma.user.updateMany({
      where: { refreshToken },
      data: { refreshToken: '' },
    });

    if (!user) throw new NotFoundError('User not found');

    res.clearCookie('accessToken', {
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    res.clearCookie('refreshToken', {
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).send('Logged out successfully');
  } catch (error) {
    next(error);
  }
};
