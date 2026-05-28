import express from 'express';
import { getDashboardStats } from '../controllers/adminController.js';
import { adminLogin, getAdminProfile } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin Authentication Routes
router.post('/login', adminLogin);
router.get('/me', protect, authorize('Super Admin', 'Admin', 'superAdmin', 'admin'), getAdminProfile);

// Dashboard Statistics Route
router.route('/dashboard').get(protect, authorize('Super Admin', 'Admin', 'superAdmin', 'admin'), getDashboardStats);

export default router;
