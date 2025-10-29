import { StatusCodes } from "http-status-codes";
import { signInService, signUpService } from "../services/userService.js";

import {
  customErrorResponse,
  internalErrorResponse,
  successResponse,
} from "../utils/common/responseObject.js";

const allowedRoles = ["user", "manager", "admin"];

export const signUp = async (req, res) => {
  try {
    const { role } = req.body;

    if (role && !allowedRoles.includes(role)) {
      return res.status(StatusCodes.BAD_REQUEST).json(
        customErrorResponse({
          message: "Invalid role assigned",
          explanation: `Role must be one of: ${allowedRoles.join(", ")}`,
        })
      );
    }

    const user = await signUpService(req.body);
    return res
      .status(StatusCodes.CREATED)
      .json(successResponse(user, "User created successfully"));
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const signIn = async (req, res) => {
  try {
    const response = await signInService(req.body);
    if (response) {
      return res
        .status(StatusCodes.OK)
        .json(successResponse(response, "User signed in successfully"));
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(customErrorResponse({ message: "Invalid credentials" }));
    }
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
