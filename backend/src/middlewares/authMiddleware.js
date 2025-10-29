import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import {
  customErrorResponse,
  internalErrorResponse,
} from '../utils/common/responseObject.js';
import { JWT_SECRET } from '../config/serverConfig.js';

import userRepository from './../repositories/userRepository.js';

export const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer') ? authHeader.split(' ')[1] : null;
  if (!token) {
    return res.status(StatusCodes.FORBIDDEN).json(
      customErrorResponse({
        explanation: 'Invalid data sent from the client',
        message: 'No auth token is provided1',
      })
    );
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          explanation: 'Invalid data sent from the client',
          message: 'No auth token is provided',
        })
      );
    }

    const user = await userRepository.getById(decoded.id)

    req.user = user
    next();
  } catch (error) {
    if (error.name === 'jsonWebTokenError') {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          explanation: 'Invalid data sent from the client',
          message: 'No auth token provided',
        })
      );
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};


