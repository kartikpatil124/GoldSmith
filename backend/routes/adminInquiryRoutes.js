import express from 'express';
import {
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  respondToInquiry,
  deleteInquiry
} from '../controllers/inquiryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('Super Admin', 'Admin', 'admin', 'superAdmin'));

router.route('/')
  .get(getInquiries);

router.route('/:id')
  .get(getInquiryById)
  .delete(deleteInquiry);

router.route('/:id/status')
  .patch(updateInquiryStatus);

router.route('/:id/respond')
  .patch(respondToInquiry);

export default router;
