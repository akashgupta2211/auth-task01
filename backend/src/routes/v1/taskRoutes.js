import express from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,
  unassignTask,
  getAssignedTasks,
} from "../../controllers/taskController.js";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";
import { authorizeRoles } from "../../middlewares/roleMiddleware.js";

const router = express.Router();
router.use(isAuthenticated);
router.post("/", createTask);

// Get all tasks (role-based filtering applied in service layer)
// Query params: status, priority, search, sortBy, sortOrder, page, limit
router.get("/", getAllTasks);

// Get tasks assigned to the authenticated user
router.get("/assigned", getAssignedTasks);

// Get a specific task by ID
router.get("/:taskId", getTaskById);

// Update a task (only creator or admin can update)
router.put("/:taskId", updateTask);

// Delete a task (only creator or admin can delete)
router.delete("/:taskId", deleteTask);

// Task Assignment Operations (managers and admins only)

// Assign task to users
router.post(
  "/:taskId/assign",
  authorizeRoles(["admin", "manager"]),
  assignTask
);

// Unassign task from users
router.post(
  "/:taskId/unassign",
  authorizeRoles(["admin", "manager"]),
  unassignTask
);

export default router;
