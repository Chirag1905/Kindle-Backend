import { validationResult } from 'express-validator';

/**
 * Middleware to handle validation errors from express-validator
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value,
      location: error.location,
    }));

    return res.status(400).json({
      error: 'Validation Error',
      message: 'The request contains invalid data',
      details: errorMessages,
      timestamp: new Date().toISOString(),
    });
  }

  next();
};

/**
 * Async wrapper to catch errors in async route handlers
 * @param {Function} fn - Async function to wrap
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Centralized error handling middleware
 * @param {Error} error - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const errorHandler = (error, req, res, next) => {
  let { statusCode = 500, message } = error;

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(error.errors).map(val => val.message).join(', ');
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    statusCode = 409;
    const field = Object.keys(error.keyValue)[0];
    message = `${field} already exists`;
  }

  // Mongoose cast error
  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  const response = {
    error: error.name || 'Internal Server Error',
    message,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

/**
 * 404 Not Found handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString(),
  });
};