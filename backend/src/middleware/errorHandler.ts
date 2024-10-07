import express from 'express';

interface CustomError extends Error {
  statusCode?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: CustomError, req: express.Request, res: express.Response, next: express.NextFunction): void => {
  // Log the error stack in development for debugging purposes
  if (process.env.NODE_ENV === 'development') {
    console.error('Error stack: ', err.stack);
  }

  // Determine the status code based on the err type
  const statusCode = err.statusCode || 500;

  // Construct the response object
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

  // Include the stack trace in the response if in development
  if (process.env.NODE_ENV === 'development' && err.stack) {
    response.stack = err.stack;
  }

  // Send the response
  res.status(statusCode).json(response);
};

export default errorHandler;
