import { StatusCodes } from 'http-status-codes';
import { customErrorResponse } from '../utils/common/responseObject.js';  

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          explanation: 'Access denied',
          message: 'You do not have permission to access this resource',
        })
      );
    }
    next();
  };
};