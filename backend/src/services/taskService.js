import { StatusCodes } from "http-status-codes";
import taskRepository from "../repositories/taskRepository.js";
import clientError from "../utils/error/clientError.js";
import validationError from "../utils/error/validationError.js";

const taskService = {
  createTask: async (data, userId) => {
    try {
      const taskData = {
        ...data,
        createdBy: userId,
      };
      const newTask = await taskRepository.create(taskData);
      return newTask;
    } catch (error) {
      if (error.name === "ValidationError") {
        throw new validationError({ error: error.errors }, error.message);
      }
      throw error;
    }
  },

  getTasks: async (filter) => {
    try {
      const tasks = await taskRepository.findAll(filter);
      return tasks;
    } catch (error) {
      throw error;
    }
  },

  updateTask: async (taskId, data) => {
    try {
      const task = await taskRepository.findById(taskId);
      if (!task) {
        throw new clientError({
          message: "Task not found",
          explanation: "No task exists with the provided ID",
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      const updatedTask = await taskRepository.update(taskId, data);
      return updatedTask;
    } catch (error) {
      if (error.name === "ValidationError") {
        throw new validationError({ error: error.errors }, error.message);
      }
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    try {
      const task = await taskRepository.findById(taskId);
      if (!task) {
        throw new clientError({
          message: "Task not found",
          explanation: "No task exists witha the provided ID",
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      await taskRepository.delete(taskId);
      return true;
    } catch (error) {
      throw error;
    }
  },

  assignTask: async (taskId, userId) => {
    try {
      const task = await taskRepository.findById(taskId);
      if (!task) {
        throw new clientError({
          message: "Task not found",
          explanation: "No task exists with the provided ID",
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      const updatedTask = await taskRepository.update(taskId, {
        assignedTo: userId,
      });
      return updatedTask;
    } catch (error) {
      throw error;
    }
  },

  getAssignedTasks: async (userId) => {
    try {
      const tasks = await taskRepository.findByAssignedUser(userId);
      return tasks;
    } catch (error) {
      throw error;
    }
  },
};

export default taskService;
