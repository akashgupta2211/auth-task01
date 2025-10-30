import { z } from "zod";

export const userSignUpSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username cannot exceed 50 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Username must contain only letters and numbers")
    .trim(),

  email: z.string().email("Invalid email format").trim().toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),

  role: z
    .enum(["user", "admin", "manager"], {
      errorMap: () => ({ message: "Role must be user, admin, or manager" }),
    })
    .optional()
    .default("user"),
});

export const userSignInSchema = z.object({
  email: z.string().email("Invalid email format").trim().toLowerCase(),

  password: z.string().min(1, "Password is required"),
});
