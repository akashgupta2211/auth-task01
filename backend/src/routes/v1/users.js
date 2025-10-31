import express from "express";
import {
  signIn,
  signUp,
  fetchUsersByAdminRole,
  fetchUsersByManagerRole,
  fetchUserProfile,
} from "../../controllers/userController.js";
import {
  userSignInSchema,
  userSignUpSchema,
} from "../../validators/userSchema.js";
import { validate } from "../../validators/zodValidators.js";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";
import { authorizeRoles } from "../../middlewares/roleMiddleware.js";
import { checkManagerRoleAccess } from "../../middlewares/authorizeUserRole.js";

const router = express.Router();

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
 *               name:
 *                 type: string
 *                 example: John Doe
 *               role:
 *                 type: string
 *                 enum: [admin, manager, user]
 *                 example: user
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/signup", validate(userSignUpSchema), signUp);

/**
 * @swagger
 * /users/signin:
 *   post:
 *     summary: Sign in a user
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/signin", validate(userSignInSchema), signIn);

/**
 * @swagger
 * /users/admin:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
  "/admin",
  isAuthenticated,
  authorizeRoles("admin"),
  fetchUsersByAdminRole
);

/**
 * @swagger
 * /users/manager:
 *   get:
 *     summary: Get users managed by the current manager
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: Admin can see all users, Manager can see only their assigned users
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
  "/manager",
  isAuthenticated,
  authorizeRoles("admin", "manager"),
  checkManagerRoleAccess,
  fetchUsersByManagerRole
);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  "/profile",
  isAuthenticated,
  authorizeRoles("admin", "manager", "user"),
  fetchUserProfile
);

/**
 * @swagger
 * /users/:
 *   get:
 *     summary: Test endpoint
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Test response
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: for testing
 */
router.get("/", (req, res) => {
  return res.status(200).json("for testing");
});

export default router;
