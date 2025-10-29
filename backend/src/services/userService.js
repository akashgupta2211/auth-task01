import { StatusCodes } from "http-status-codes";
import userRepository from "../repositories/userRepository.js";
import clientError from "../utils/error/clientError.js";
import bcrypt from "bcryptjs";
import { createJwt } from "../utils/common/authUtils.js";
import validationError from "../utils/error/validationError.js";

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
        message: "Invalid email",
        explanation: "Invalid email sent from the client side",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }
    const match = bcrypt.compareSync(data.password, user.password);
    if (!match) {
      throw new clientError({
        message: "Invalid email",
        explanation: "Invalid email sent from the client side",
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    return {
      username: user.username,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
      role: user.role,
      token: createJwt({ id: user._id, email: user.email, role: user.role }),
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
    throw new Error(
      "An unexpected error occurred while fetching users by role."
    );
  }
};

export const getUserDataByManagerRole = async (role) => {
  try {
    const users = await userRepository.getUsersByManagerRole(role);
    return users;
  } catch (error) {
    console.error("Error fetching users by role:", error);
    throw new Error(
      "An unexpected error occurred while fetching users by role."
    );
  }
};

export const getUserProfile = async (username) => {
  try {
    const users = await userRepository.getUserByUsername(username);
    return users;
  } catch (error) {
    console.error("Error fetching users by  role:", error);
    throw new Error(
      "An unexpected error occurred while fetching users by role."
    );
  }
};
