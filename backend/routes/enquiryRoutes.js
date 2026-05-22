import express from 'express';
import { createEnquiry, getEnquiries, updateEnquiryStatus } from '../controllers/enquiryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('Super Admin', 'Admin'), getEnquiries)
  .post(createEnquiry);

router.route('/:id/status')
  .put(protect, authorize('Super Admin', 'Admin'), updateEnquiryStatus);

export default router;
