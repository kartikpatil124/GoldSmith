import express from 'express';
import { getDashboardStats } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/dashboard').get(protect, authorize('Super Admin', 'Admin'), getDashboardStats);

export default router;
