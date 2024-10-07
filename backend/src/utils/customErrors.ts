/**
 * Custom error class for handling errors in the application
 *
 * @class AppError
 * @extends Error
 * @param {string} message - The error message
 * @param {number} statusCode - The HTTP status code
 */
class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    // Capture the stack trace (only in development mode)
    if (process.env.NODE_ENV === 'development') {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Custom error class for not found resources
 * @class NotFoundError
 * @extends AppError
 * @param {string} message - The error message
 * @param {number} statusCode - The HTTP status code
 * @constructor
 */
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

/**
 * @description Custom error class for unauthorized access
 * @class UnauthorizedError
 * @extends AppError
 * @param {string} message - The error message
 * @param {number} statusCode - The HTTP status code
 * @constructor
 */
class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

export { AppError, NotFoundError, UnauthorizedError };
