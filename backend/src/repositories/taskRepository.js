import Task from "../schema/task.js";
import crudRepository from "./crudRepository.js";

const taskRepository = {
  ...crudRepository(Task),

  // Create a new task
  createTask: async (data) => {
    const newTask = new Task(data);
    await newTask.save();
    return await newTask.populate([
      { path: "createdBy", select: "-password" },
      { path: "assignedTo", select: "-password" },
    ]);
  },

  // Get all tasks with filters, sorting, and pagination
  getAllTasks: async (filters = {}, sortOptions = {}, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const tasks = await Task.find(filters)
      .populate("createdBy", "-password")
      .populate("assignedTo", "-password")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(filters);

    return {
      tasks,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };
  },

  // Get task by ID
  getTaskById: async (taskId) => {
    const task = await Task.findById(taskId)
      .populate("createdBy", "-password")
      .populate("assignedTo", "-password");
    return task;
  },

  // Update task
  updateTask: async (taskId, updateData) => {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate("createdBy", "-password")
      .populate("assignedTo", "-password");
    return updatedTask;
  },

  // Delete task
  deleteTask: async (taskId) => {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    return deletedTask;
  },

  // Get tasks by user (created by or assigned to)
  getTasksByUser: async (userId, filters = {}, sortOptions = {}) => {
    const tasks = await Task.find({
      $or: [{ createdBy: userId }, { assignedTo: userId }],
      ...filters,
    })
      .populate("createdBy", "-password")
      .populate("assignedTo", "-password")
      .sort(sortOptions);
    return tasks;
  },

  // Get assigned tasks for a user
  getAssignedTasks: async (userId, filters = {}, sortOptions = {}) => {
    const tasks = await Task.find({
      assignedTo: userId,
      ...filters,
    })
      .populate("createdBy", "-password")
      .populate("assignedTo", "-password")
      .sort(sortOptions);
    return tasks;
  },

  // Assign task to users
  assignTaskToUsers: async (taskId, userIds) => {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { $addToSet: { assignedTo: { $each: userIds } } },
      { new: true, runValidators: true }
    )
      .populate("createdBy", "-password")
      .populate("assignedTo", "-password");
    return task;
  },

  // Unassign task from users
  unassignTaskFromUsers: async (taskId, userIds) => {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { $pull: { assignedTo: { $in: userIds } } },
      { new: true, runValidators: true }
    )
      .populate("createdBy", "-password")
      .populate("assignedTo", "-password");
    return task;
  },

  // Get tasks for manager's team
  getTasksByTeam: async (managerRole, filters = {}, sortOptions = {}) => {
    const tasks = await Task.find(filters)
      .populate({
        path: "createdBy",
        select: "-password",
        match: { role: { $in: ["manager", "admin"] } },
      })
      .populate({
        path: "assignedTo",
        select: "-password",
        match: { role: { $in: ["user", "manager"] } },
      })
      .sort(sortOptions);
    return tasks;
  },
};

export default taskRepository;
