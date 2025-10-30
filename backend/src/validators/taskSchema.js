import { z } from "zod";

export const taskCreateSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters")
    .trim(),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .trim()
    .optional(),

  dueDate: z
    .string()
    .datetime("Invalid date format")
    .refine(
      (date) => new Date(date) >= new Date(),
      "Due date cannot be in the past"
    )
    .optional()
    .or(z.literal("")),

  priority: z
    .enum(["low", "medium", "high"], {
      errorMap: () => ({ message: "Priority must be low, medium, or high" }),
    })
    .optional()
    .default("medium"),

  status: z
    .enum(["pending", "in-progress", "completed"], {
      errorMap: () => ({
        message: "Status must be pending, in-progress, or completed",
      }),
    })
    .optional()
    .default("pending"),
});

export const taskUpdateSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters")
    .trim()
    .optional(),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .trim()
    .optional(),

  dueDate: z
    .string()
    .datetime("Invalid date format")
    .refine(
      (date) => new Date(date) >= new Date(),
      "Due date cannot be in the past"
    )
    .optional()
    .or(z.literal("")),

  priority: z
    .enum(["low", "medium", "high"], {
      errorMap: () => ({ message: "Priority must be low, medium, or high" }),
    })
    .optional(),

  status: z
    .enum(["pending", "in-progress", "completed"], {
      errorMap: () => ({
        message: "Status must be pending, in-progress, or completed",
      }),
    })
    .optional(),
});

export const taskAssignSchema = z.object({
  assignedTo: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format")
    .min(1, "Assigned user ID is required"),
});
