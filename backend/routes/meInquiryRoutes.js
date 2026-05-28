import express from 'express';
import { getMyInquiries } from '../controllers/inquiryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getMyInquiries);

export default router;
