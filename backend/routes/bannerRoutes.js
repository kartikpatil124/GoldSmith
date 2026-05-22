import express from 'express';
import { getBanners, getAllBanners, createBanner, updateBanner, deleteBanner } from '../controllers/bannerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getBanners);
router.get('/all', protect, authorize('Super Admin', 'Admin'), getAllBanners);
router.post('/', protect, authorize('Super Admin', 'Admin'), createBanner);
router.put('/:id', protect, authorize('Super Admin', 'Admin'), updateBanner);
router.delete('/:id', protect, authorize('Super Admin', 'Admin'), deleteBanner);

export default router;
