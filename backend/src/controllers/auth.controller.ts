import express from 'express';
import { AppError } from '../utils/customErrors';
import { Login } from 'types/auth';
import AuthService from '../services/authService';

export const login = async (req: express.Request<object, object, Login>, res: express.Response, next: express.NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    // Check if the refreshToken is provided
    if (!refreshToken) {
      return next(new AppError('Refresh token not provided', 400));
    }

    // Call AuthService to refresh the token
    const result = await AuthService.refreshToken(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed',
      accessToken: result.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    const result = await AuthService.logout(refreshToken);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};
