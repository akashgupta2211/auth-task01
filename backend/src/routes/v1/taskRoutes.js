import express from 'express';
import taskController from '../../controllers/taskController.js';
import { authorizeRoles } from '../../middlewares/roleMiddleware.js'; 
import { isAuthenticated } from '../../middlewares/authMiddleware.js';
import {authorizeUserRole, authorizeUserRole1} from '../../middlewares/authorizeUserRole.js';  

const router = express.Router();
 
router.post('/', isAuthenticated, authorizeRoles('admin', 'manager'), authorizeUserRole1, taskController.createTask);
router.get('/', isAuthenticated, authorizeRoles('admin', 'manager', 'user'),authorizeUserRole1, taskController.getTasks);
router.put('/:id', isAuthenticated, authorizeRoles('admin', 'manager'), taskController.updateTask);
router.delete('/:id', isAuthenticated, authorizeRoles('admin', 'manager'), taskController.deleteTask);

 
router.post('/:id/assign', isAuthenticated, authorizeRoles('manager'), authorizeUserRole, taskController.assignTask);
router.get('/assigned/:userId', isAuthenticated, authorizeRoles('admin', 'manager', 'user'),authorizeUserRole1, taskController.getAssignedTasks);

export default router;