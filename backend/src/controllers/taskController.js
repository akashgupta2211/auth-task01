import { StatusCodes } from "http-status-codes";
import taskService from "../services/taskService.js";
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse,
} from "../utils/common/responseObject.js";

const taskController = {
  createTask: async (req, res) => {
    try {
      const task = await taskService.createTask(req.body, req.user._id);
      return res
        .status(StatusCodes.CREATED)
        .json(successResponse(task, "Task created successfully"));
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json(customErrorResponse(error));
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(internalErrorResponse(error));
    }
  },

  getTasks: async (req, res) => {
    try {
      const { priority, status, dueDateFrom, dueDateTo } = req.query;

      const filter = {};

      if (priority) {
        filter.priority = priority;
      }

      if (status) {
        filter.status = status;
      }

      if (dueDateFrom || dueDateTo) {
        filter.dueDate = {};
        if (dueDateFrom) filter.dueDate.$gte = new Date(dueDateFrom);
        if (dueDateTo) filter.dueDate.$lte = new Date(dueDateTo);
      }

      const tasks = await taskService.getTasks(filter);
      return res
        .status(StatusCodes.OK)
        .json(successResponse(tasks, "Tasks fetched successfully"));
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json(customErrorResponse(error));
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(internalErrorResponse(error));
    }
  },

  updateTask: async (req, res) => {
    try {
      const task = await taskService.updateTask(req.params.id, req.body);
      return res
        .status(StatusCodes.OK)
        .json(successResponse(task, "Task updated successfully"));
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json(customErrorResponse(error));
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(internalErrorResponse(error));
    }
  },

  deleteTask: async (req, res) => {
    try {
      await taskService.deleteTask(req.params.id);
      return res
        .status(StatusCodes.OK)
        .json(successResponse(null, "Task deleted successfully"));
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json(customErrorResponse(error));
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(internalErrorResponse(error));
    }
  },

  assignTask: async (req, res) => {
    try {
      const task = await taskService.assignTask(
        req.params.id,
        req.body.assignedTo
      );
      return res
        .status(StatusCodes.OK)
        .json(successResponse(task, "Task assigned successfully"));
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json(customErrorResponse(error));
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(internalErrorResponse(error));
    }
  },

  getAssignedTasks: async (req, res) => {
    try {
      const tasks = await taskService.getAssignedTasks(req.params.userId);
      return res
        .status(StatusCodes.OK)
        .json(successResponse(tasks, "Assigned tasks fetched successfully"));
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json(customErrorResponse(error));
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(internalErrorResponse(error));
    }
  },
};

export default taskController;
