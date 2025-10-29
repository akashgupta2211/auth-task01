import { StatusCodes } from "http-status-codes";
import taskRepository from "../repositories/taskRepository.js";
import userRepository from "../repositories/userRepository.js";
import clientError from "../utils/error/clientError.js";
import validationError from "../utils/error/validationError.js";

// Create a new task
export const createTaskService = async (data, userId) => {
  try {
    const taskData = {
      ...data,
      createdBy: userId,
    };

    const newTask = await taskRepository.createTask(taskData);
    return newTask;
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new validationError({ error: error.errors }, error.message);
    }
    throw error;
  }
};

// Get all tasks with role-based filtering
export const getAllTasksService = async (
  filters,
  sortOptions,
  page,
  limit,
  userRole,
  userId
) => {
  try {
    let queryFilters = { ...filters };

    // Apply role-based filtering
    if (userRole === "user") {
      // Users can only see their own tasks
      queryFilters = {
        ...queryFilters,
        $or: [{ createdBy: userId }, { assignedTo: userId }],
      };
    } else if (userRole === "manager") {
      // Managers can see tasks they created or are assigned to
      queryFilters = {
        ...queryFilters,
        $or: [{ createdBy: userId }, { assignedTo: userId }],
      };
    }
    // Admins can see all tasks (no additional filters)

    const tasks = await taskRepository.getAllTasks(
      queryFilters,
      sortOptions,
      page,
      limit
    );
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("An unexpected error occurred while fetching tasks.");
  }
};

// Get task by ID with access control
export const getTaskByIdService = async (taskId, userId, userRole) => {
  try {
    const task = await taskRepository.getTaskById(taskId);

    if (!task) {
      throw new clientError({
        message: "Task not found",
        explanation: "The requested task does not exist",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    // Check access permissions
    if (userRole === "user") {
      const hasAccess =
        task.createdBy._id.toString() === userId ||
        task.assignedTo.some((user) => user._id.toString() === userId);

      if (!hasAccess) {
        throw new clientError({
          message: "Access denied",
          explanation: "You don't have permission to view this task",
          statusCode: StatusCodes.FORBIDDEN,
        });
      }
    } else if (userRole === "manager") {
      const hasAccess =
        task.createdBy._id.toString() === userId ||
        task.assignedTo.some((user) => user._id.toString() === userId);

      if (!hasAccess) {
        throw new clientError({
          message: "Access denied",
          explanation: "You don't have permission to view this task",
          statusCode: StatusCodes.FORBIDDEN,
        });
      }
    }

    return task;
  } catch (error) {
    throw error;
  }
};

// Update task with access control
export const updateTaskService = async (
  taskId,
  updateData,
  userId,
  userRole
) => {
  try {
    const task = await taskRepository.getTaskById(taskId);

    if (!task) {
      throw new clientError({
        message: "Task not found",
        explanation: "The requested task does not exist",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    // Check permissions
    if (userRole === "user" && task.createdBy._id.toString() !== userId) {
      throw new clientError({
        message: "Access denied",
        explanation: "You can only update tasks you created",
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    if (userRole === "manager" && task.createdBy._id.toString() !== userId) {
      throw new clientError({
        message: "Access denied",
        explanation: "You can only update tasks you created",
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    const updatedTask = await taskRepository.updateTask(taskId, updateData);
    return updatedTask;
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new validationError({ error: error.errors }, error.message);
    }
    throw error;
  }
};

// Delete task with access control
export const deleteTaskService = async (taskId, userId, userRole) => {
  try {
    const task = await taskRepository.getTaskById(taskId);

    if (!task) {
      throw new clientError({
        message: "Task not found",
        explanation: "The requested task does not exist",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    // Check permissions
    if (userRole === "user" && task.createdBy._id.toString() !== userId) {
      throw new clientError({
        message: "Access denied",
        explanation: "You can only delete tasks you created",
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    if (userRole === "manager" && task.createdBy._id.toString() !== userId) {
      throw new clientError({
        message: "Access denied",
        explanation: "You can only delete tasks you created",
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    const deletedTask = await taskRepository.deleteTask(taskId);
    return deletedTask;
  } catch (error) {
    throw error;
  }
};

// Assign task to users
export const assignTaskService = async (taskId, userIds, userId, userRole) => {
  try {
    const task = await taskRepository.getTaskById(taskId);

    if (!task) {
      throw new clientError({
        message: "Task not found",
        explanation: "The requested task does not exist",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    // Check permissions
    if (userRole === "user") {
      throw new clientError({
        message: "Access denied",
        explanation: "Users cannot assign tasks",
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    if (userRole === "manager" && task.createdBy._id.toString() !== userId) {
      throw new clientError({
        message: "Access denied",
        explanation: "Managers can only assign tasks they created",
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    // Validate that users exist and have appropriate roles
    for (const assigneeId of userIds) {
      const user = await userRepository.getById(assigneeId);
      if (!user) {
        throw new clientError({
          message: "User not found",
          explanation: `User with id ${assigneeId} does not exist`,
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      // Managers can only assign to users and managers
      if (userRole === "manager" && user.role === "admin") {
        throw new clientError({
          message: "Access denied",
          explanation: "Managers cannot assign tasks to admins",
          statusCode: StatusCodes.FORBIDDEN,
        });
      }
    }

    const updatedTask = await taskRepository.assignTaskToUsers(taskId, userIds);
    return updatedTask;
  } catch (error) {
    throw error;
  }
};

// Unassign task from users
export const unassignTaskService = async (
  taskId,
  userIds,
  userId,
  userRole
) => {
  try {
    const task = await taskRepository.getTaskById(taskId);

    if (!task) {
      throw new clientError({
        message: "Task not found",
        explanation: "The requested task does not exist",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    // Check permissions
    if (userRole === "user") {
      throw new clientError({
        message: "Access denied",
        explanation: "Users cannot unassign tasks",
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    if (userRole === "manager" && task.createdBy._id.toString() !== userId) {
      throw new clientError({
        message: "Access denied",
        explanation: "Managers can only unassign from tasks they created",
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    const updatedTask = await taskRepository.unassignTaskFromUsers(
      taskId,
      userIds
    );
    return updatedTask;
  } catch (error) {
    throw error;
  }
};

// Get assigned tasks for a user
export const getAssignedTasksService = async (userId) => {
  try {
    const tasks = await taskRepository.getAssignedTasks(userId);
    return tasks;
  } catch (error) {
    console.error("Error fetching assigned tasks:", error);
    throw new Error(
      "An unexpected error occurred while fetching assigned tasks."
    );
  }
};
