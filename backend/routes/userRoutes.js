import express from 'express';
import { getCustomers, getCustomerById } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/customers').get(protect, authorize('Super Admin', 'Admin'), getCustomers);
router.route('/customers/:id').get(protect, authorize('Super Admin', 'Admin'), getCustomerById);

export default router;
