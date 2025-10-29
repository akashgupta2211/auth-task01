import express from "express";

import userRouters from "./users.js";
import taskRoutes from "./taskRoutes.js";
const router = express.Router();
router.use("/users", userRouters);
router.use("/task", taskRoutes);
export default router;
