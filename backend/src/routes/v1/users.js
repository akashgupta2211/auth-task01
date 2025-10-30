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

router.post("/signup", validate(userSignUpSchema), signUp);
router.post("/signin", validate(userSignInSchema), signIn);

router.get(
  "/admin",
  isAuthenticated,
  authorizeRoles("admin"),
  fetchUsersByAdminRole
);

router.get(
  "/manager",
  isAuthenticated,
  authorizeRoles("admin", "manager"),
  checkManagerRoleAccess,
  fetchUsersByManagerRole
);

router.get(
  "/profile",
  isAuthenticated,
  authorizeRoles("admin", "manager", "user"),
  fetchUserProfile
);

router.get("/", (req, res) => {
  return res.status(200).json("for testing");
});

export default router;
