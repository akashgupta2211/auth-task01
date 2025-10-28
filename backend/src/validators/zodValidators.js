import { StatusCodes } from 'http-status-codes';
import { customErrorResponse } from '../utils/common/responseObject.js';
export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      let explanation = [];

      error.errors.forEach((key) => {
        explanation.push(key.message);
      });
      res.status(StatusCodes.BAD_REQUEST).json(
        customErrorResponse({
          message: 'Validation Error',
          explanation: explanation,
        })
      );
    }
  };
};
