import express from 'express';
import {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  respondToInquiry,
  deleteInquiry,
  getMyInquiries
} from '../controllers/inquiryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to submit inquiry (uses optional JWT if present)
const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.route('/')
  .post(optionalProtect, createInquiry)
  .get(protect, authorize('Super Admin', 'Admin'), getInquiries);

router.route('/my')
  .get(protect, getMyInquiries);

router.route('/:id')
  .get(protect, getInquiryById)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteInquiry);

router.route('/:id/status')
  .patch(protect, authorize('Super Admin', 'Admin'), updateInquiryStatus);

router.route('/:id/respond')
  .patch(protect, authorize('Super Admin', 'Admin'), respondToInquiry);

export default router;
