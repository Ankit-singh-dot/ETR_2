import { errorResponse } from '../utils/responseHandler.js';

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Prisma errors
  if (err.code === 'P2002') {
    return errorResponse(res, 'Duplicate entry found', 409);
  }
  
  if (err.code === 'P2025') {
    return errorResponse(res, 'Record not found', 404);
  }
  
  if (err.code === 'P2003') {
    return errorResponse(res, 'Foreign key constraint failed', 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', 401);
  }
  
  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', 401);
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return errorResponse(res, 'Validation failed', 400, err.errors);
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  return errorResponse(res, message, statusCode);
};

export const notFound = (req, res) => {
  return errorResponse(res, 'Route not found', 404);
}; 