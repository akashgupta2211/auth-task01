import { StatusCodes } from "http-status-codes";
import { customErrorResponse } from "../utils/common/responseObject.js";

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      const explanation = [];

      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err) => {
          explanation.push(err.message);
        });
      } else if (error.issues && Array.isArray(error.issues)) {
        error.issues.forEach((issue) => {
          explanation.push(issue.message);
        });
      } else if (error.message) {
        explanation.push(error.message);
      } else {
        explanation.push("Validation failed");
      }

      return res.status(StatusCodes.BAD_REQUEST).json(
        customErrorResponse({
          message: "Validation Error",
          explanation: explanation,
        })
      );
    }
  };
};
