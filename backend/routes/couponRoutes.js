import express from 'express';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon } from '../controllers/couponController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('Super Admin', 'Admin'), getCoupons)
  .post(protect, authorize('Super Admin', 'Admin'), createCoupon);

router.route('/:id')
  .put(protect, authorize('Super Admin', 'Admin'), updateCoupon)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteCoupon);

router.post('/validate', validateCoupon);

export default router;
