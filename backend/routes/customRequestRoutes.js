import express from 'express';
import { 
  getCustomRequests, 
  createCustomRequest, 
  updateCustomRequestStatus,
  deleteCustomRequest
} from '../controllers/customRequestController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('Super Admin', 'Admin'), getCustomRequests)
  .post(createCustomRequest);

router.route('/:id/status')
  .put(protect, authorize('Super Admin', 'Admin'), updateCustomRequestStatus);

router.route('/:id')
  .delete(protect, authorize('Super Admin', 'Admin'), deleteCustomRequest);

export default router;
