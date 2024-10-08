import express from 'express';

interface CustomError extends Error {
  statusCode?: number;
}

/**
 * Centralized error handler middleware for Express.js
 *
 * @param {Error & { statusCode?: number }} err - The error object to be handled
 * @param {import('express').Request} req - The Express.js request object
 * @param {import('express').Response} res - The Express.js response object
 * @param {import('express').NextFunction} next - The next middleware function in the stack
 *
 * @description
 * This middleware logs the error stack in development mode and constructs a JSON response with
 * the error status code, message, and optional stack trace. The response is sent with the
 * appropriate HTTP status code.
 *
 * @see https://expressjs.com/en/guide/error-handling.html
 */
const errorHandler = (err: CustomError, req: express.Request, res: express.Response, _next: express.NextFunction): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error stack: ', err.stack);
  }

  const statusCode = err.statusCode || 500;

  // Construct the response object with status code, message, and optional stack trace
  const response: {
    success: boolean;
    statusCode: number;
    message: string;
    stack?: string;
  } = {
    success: false,
    statusCode,
    message: err.message || 'Internal Server Error',
  };

  if (process.env.NODE_ENV === 'development' && err.stack) {
    response.stack = err.stack;
  }

  // Send the constructed error response as JSON
  res.status(statusCode).json(response);
};

export default errorHandler;
