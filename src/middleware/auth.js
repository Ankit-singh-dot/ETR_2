import { verifyToken, extractTokenFromHeader } from '../utils/auth.js';
import { errorResponse } from '../utils/responseHandler.js';
import prisma from '../config/db.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req);
    
    if (!token) {
      return errorResponse(res, 'Access token required', 401);
    }

    const decoded = verifyToken(token);
    const user = await prisma.userLogin.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      return errorResponse(res, 'User not found', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Invalid or expired token', 401);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required', 401);
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 'Insufficient permissions', 403);
    }

    next();
  };
};

export const requireAdmin = authorize('ADMIN');
export const requireSubAdmin = authorize('SUBADMIN');
export const requireStudent = authorize('STUDENT');
export const requireAdminOrSubAdmin = authorize('ADMIN', 'SUBADMIN'); 