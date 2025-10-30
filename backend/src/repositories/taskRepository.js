import Task from "../schema/task.js";

const taskRepository = {
  create: async (data) => {
    const task = new Task(data);
    return await task.save();
  },

  findAll: async (filter = {}) => {
    return await Task.find(filter)
      .populate("createdBy", "username email avatar")
      .populate("assignedTo", "username email avatar")
      .sort({ createdAt: -1 });
  },

  findById: async (id) => {
    return await Task.findById(id)
      .populate("createdBy", "username email avatar")
      .populate("assignedTo", "username email avatar");
  },

  update: async (id, data) => {
    return await Task.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate("createdBy", "username email avatar")
      .populate("assignedTo", "username email avatar");
  },

  delete: async (id) => {
    return await Task.findByIdAndDelete(id);
  },

  findByAssignedUser: async (userId) => {
    return await Task.find({ assignedTo: userId })
      .populate("createdBy", "username email avatar")
      .populate("assignedTo", "username email avatar")
      .sort({ createdAt: -1 });
  },
};

export default taskRepository;
