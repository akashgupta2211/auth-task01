import express from 'express';

import userRouters from './users.js';
const router = express.Router();
router.use('/users', userRouters);
export default router;
