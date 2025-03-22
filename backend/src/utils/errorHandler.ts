import { Express, Request, Response, NextFunction } from 'express';
import logger from './logger';

// Custom error class with status code
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle 404 errors
const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

// Global error handler
const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = 'statusCode' in err ? err.statusCode : 500;
  const isOperational = 'isOperational' in err ? err.isOperational : false;

  // Log error
  if (statusCode >= 500) {
    logger.error(`Error: ${err.message}`, {
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  } else {
    logger.warn(`Error: ${err.message}`, {
      path: req.path,
      method: req.method,
    });
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message,
      // Only show stack trace in development
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

// Setup error handlers on Express app
export const setupErrorHandlers = (app: Express) => {
  // 404 handler - must be after all routes
  app.use(notFoundHandler);

  // Error handler - must be last middleware
  app.use(errorHandler);
};

// Async handler to catch async errors
export const asyncHandler = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Rate limiter error handler
export const rateLimitHandler = (req: Request, res: Response) => {
  res.status(429).json({
    success: false,
    error: {
      message: 'Too many requests, please try again later.',
    },
  });
};