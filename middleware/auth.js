import jwt from 'jsonwebtoken';
import { promisify } from 'util';

/**
 * Middleware to authenticate JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Access token is required',
        timestamp: new Date().toISOString(),
      });
    }

    // Promisify jwt.verify for better async handling
    const verifyAsync = promisify(jwt.verify);
    const decoded = await verifyAsync(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token Expired',
        message: 'Access token has expired',
        timestamp: new Date().toISOString(),
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid Token',
        message: 'Access token is invalid',
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(500).json({
      error: 'Authentication Error',
      message: 'Failed to authenticate token',
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Middleware to check if user has required role
 * @param {Array|string} roles - Required roles
 */
export const requireRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    const requiredRoles = Array.isArray(roles) ? roles : [roles];

    if (!userRole || !requiredRoles.includes(userRole)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions to access this resource',
        requiredRoles,
        userRole: userRole || 'none',
        timestamp: new Date().toISOString(),
      });
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token provided
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (token) {
      const verifyAsync = promisify(jwt.verify);
      const decoded = await verifyAsync(token, process.env.JWT_SECRET);
      req.user = decoded;
    }

    next();
  } catch (error) {
    // For optional auth, we don't fail on invalid tokens
    // Just continue without setting req.user
    next();
  }
};