import { StatusCodes } from "http-status-codes";
import {
  getUserDataByAdminRole,
  signInService,
  signUpService,
  getUserDataByManagerRole,
  getUserProfile,
} from "../services/userService.js";

import {
  customErrorResponse,
  internalErrorResponse,
  successResponse,
} from "../utils/common/responseObject.js";

export const signUp = async (req, res) => {
  try {
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

    if (!response) {
      return res.status(StatusCodes.UNAUTHORIZED).json(
        customErrorResponse({
          message: "Authentication failed",
          statusCode: StatusCodes.UNAUTHORIZED,
        })
      );
    }

    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, "User signed in successfully"));
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const fetchUsersByAdminRole = async (req, res) => {
  const { role } = req.query;

  try {
    const users = await getUserDataByAdminRole(role);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(users, "Data fetched successfully"));
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const fetchUsersByManagerRole = async (req, res) => {
  const { role } = req.query;

  try {
    const users = await getUserDataByManagerRole(role);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(users, "Data fetched successfully"));
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
export const fetchUserProfile = async (req, res) => {
  const userId = req.user._id;

  try {
    const profile = await getUserProfile(userId);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(profile, "Profile fetched successfully"));
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
