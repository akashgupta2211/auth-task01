import { StatusCodes } from "http-status-codes";
import User from "../schema/user.js";
import {
  customErrorResponse,
  internalErrorResponse,
} from "../utils/common/responseObject.js";

export const authorizeUserRole = async (req, res, next) => {
  try {
    const assignedUserId = req.body.assignedTo;

    if (!assignedUserId) {
      return res.status(StatusCodes.BAD_REQUEST).json(
        customErrorResponse({
          explanation: "Assigned user ID is required",
          message: "assignedTo field is missing",
          statusCode: StatusCodes.BAD_REQUEST,
        })
      );
    }

    const user = await User.findById(assignedUserId);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json(
        customErrorResponse({
          explanation: "User does not exist",
          message: "User not found",
          statusCode: StatusCodes.NOT_FOUND,
        })
      );
    }

    if (user.role === "user") {
      return next();
    }

    return res.status(StatusCodes.FORBIDDEN).json(
      customErrorResponse({
        explanation: "Tasks can only be assigned to users with 'user' role",
        message: "Forbidden: you cannot assign task to admin or manager",
        statusCode: StatusCodes.FORBIDDEN,
      })
    );
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const authorizeUserRole1 = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const requestedUserId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json(
        customErrorResponse({
          explanation: "User does not exist",
          message: "User not found",
          statusCode: StatusCodes.NOT_FOUND,
        })
      );
    }

    if (user.role === "admin" || user.role === "manager") {
      return next();
    }

    if (userId.toString() === requestedUserId) {
      return next();
    }

    return res.status(StatusCodes.FORBIDDEN).json(
      customErrorResponse({
        explanation: "You do not have permission to view other users' tasks",
        message: "Forbidden: you can only view your own tasks",
        statusCode: StatusCodes.FORBIDDEN,
      })
    );
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const checkManagerRoleAccess = (req, res, next) => {
  const { role } = req.query;
  const currentUserRole = req.user.role;

  if (currentUserRole === "manager") {
    if (role && (role === "admin" || role === "manager")) {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          explanation: "Managers cannot view admin or manager roles",
          message: "Access denied",
          statusCode: StatusCodes.FORBIDDEN,
        })
      );
    }
  }

  next();
};

export default authorizeUserRole;
