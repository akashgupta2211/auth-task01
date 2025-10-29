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
      .json(successResponse(user, "User created successfull"));
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
    console.log(response, "HIIII");
    if (response)
      return res
        .status(StatusCodes.OK)
        .json(successResponse(response, "User signin successfully"));
    else {
      return res.status(error.statusCode).json(customErrorResponse(error));
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

export const fetchUsersByAdminRole = async (req, res) => {
  const { role } = req.params;
  try {
    const users = await getUserDataByAdminRole(role);
    if (users)
      return res
        .status(StatusCodes.OK)
        .json(successResponse(users, "Data fetched successfully"));
    else {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
  } catch (error) {
    console.log(error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const fetchUsersByManagerRole = async (req, res) => {
  const { role } = req.params;

  console.log(role);
  try {
    const users = await getUserDataByManagerRole(role);
    if (users)
      return res
        .status(StatusCodes.OK)
        .json(successResponse(users, "Data fetched successfully"));
    else {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
  } catch (error) {
    console.log(error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const fetchUserProfile = async (req, res) => {
  const username = req.user.username;

  console.log(username);
  try {
    const users = await getUserProfile(username);
    if (users)
      return res
        .status(StatusCodes.OK)
        .json(successResponse(users, "Data fetched successfully"));
    else {
      return res.status(error.statusCode).json(customErrorResponse(error));
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
