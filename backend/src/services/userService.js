import { StatusCodes } from "http-status-codes";
import userRepository from "../repositories/userRepository.js";
import clientError from "../utils/error/clientError.js";
import bcrypt from "bcryptjs";
import { createJwt } from "../utils/common/authUtils.js";
import validationError from "../utils/error/validationError.js";

import taskRepository from "../repositories/taskRepository.js";
export const signUpService = async (data) => {
  try {
    const newUser = await userRepository.signUpUser(data);
    return newUser;
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new validationError({ error: error.errors }, error.message);
    }

    if (error.name === "MongooseError" || error.code == 11000) {
      throw new validationError(
        { error: ["A user with the same email or username already exists"] },
        "A user with the same email or username already exists"
      );
    }
  }
};

export const signInService = async (data) => {
  try {
    const user = await userRepository.getByEmail(data.email);
    if (!user) {
      throw new clientError({
        message: "Invalid email or password",
        explanation: "Invalid credentials sent from the client side",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }
    const match = bcrypt.compareSync(data.password, user.password);
    if (!match) {
      throw new clientError({
        message: "Invalid email or password",
        explanation: "Invalid credentials sent from the client side",
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    return {
      username: user.username,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
      role: user.role,
      token: createJwt({
        id: user._id,
        email: user.email,
        role: user.role,
        username: user.username,
      }),
    };
  } catch (error) {
    throw error;
  }
};

export const getUserDataByAdminRole = async (role) => {
  try {
    const users = await userRepository.getUsersByAdminRole(role);
    return users;
  } catch (error) {
    console.error("Error fetching users by role:", error);
    throw new clientError({
      message: "Failed to fetch users",
      explanation: "An error occurred while fetching users",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

export const getUserDataByManagerRole = async (role) => {
  try {
    const users = await userRepository.getUsersByManagerRole(role);
    return users;
  } catch (error) {
    console.error("Error fetching users by role:", error);
    throw new clientError({
      message: "Failed to fetch users",
      explanation: "An error occurred while fetching users",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
export const getUserProfile = async (userId) => {
  try {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new clientError({
        message: "User not found",
        explanation: "No user exists with the provided ID",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const assignedTasks = await taskRepository.findByAssignedUser(user._id);

    return {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      assignedTasks: assignedTasks,
      taskStatus: {
        total: assignedTasks.length,
        pending: assignedTasks.filter((task) => task.status === "pending")
          .length,
        inProgress: assignedTasks.filter(
          (task) => task.status === "in-progress"
        ).length,
        completed: assignedTasks.filter((task) => task.status === "completed")
          .length,
      },
    };
  } catch (error) {
    throw error;
  }
};
