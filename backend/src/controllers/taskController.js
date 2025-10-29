import { StatusCodes } from "http-status-codes";
import {
  createTaskService,
  getAllTasksService,
  getTaskByIdService,
  updateTaskService,
  deleteTaskService,
  assignTaskService,
  unassignTaskService,
  getAssignedTasksService,
} from "../services/taskService.js";
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse,
} from "../utils/common/responseObject.js";

// Create a new task
export const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const task = await createTaskService(req.body, userId);

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
};

// Get all tasks with filtering and pagination
export const getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Extract query parameters
    const {
      status,
      priority,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    // Build filters
    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const tasks = await getAllTasksService(
      filters,
      sortOptions,
      parseInt(page),
      parseInt(limit),
      userRole,
      userId
    );

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
};

// Get task by ID
export const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const task = await getTaskByIdService(taskId, userId, userRole);

    return res
      .status(StatusCodes.OK)
      .json(successResponse(task, "Task fetched successfully"));
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const task = await updateTaskService(taskId, req.body, userId, userRole);

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
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    await deleteTaskService(taskId, userId, userRole);

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
};

// Assign task to users
export const assignTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userIds } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json(
        customErrorResponse({
          message: "Invalid request",
          explanation: "userIds must be a non-empty array",
        })
      );
    }

    const task = await assignTaskService(taskId, userIds, userId, userRole);

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
};

// Unassign task from users
export const unassignTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userIds } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json(
        customErrorResponse({
          message: "Invalid request",
          explanation: "userIds must be a non-empty array",
        })
      );
    }

    const task = await unassignTaskService(taskId, userIds, userId, userRole);

    return res
      .status(StatusCodes.OK)
      .json(successResponse(task, "Task unassigned successfully"));
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

// Get assigned tasks for the authenticated user
export const getAssignedTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await getAssignedTasksService(userId);

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
};
