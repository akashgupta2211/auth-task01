import jwt from 'jsonwebtoken';
import { JWT_EXPIRY, JWT_SECRET } from '../../config/serverConfig.js';

// Create a token
   export const createJwt = (payload) => {
  return  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });

   }
