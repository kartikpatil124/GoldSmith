import express from 'express';
import { getPageContent, getAllPageContent, getPageSection, upsertPageSection, deletePageSection } from '../controllers/pageContentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPageContent);
router.get('/all', protect, authorize('Super Admin', 'Admin'), getAllPageContent);
router.get('/section', getPageSection);
router.put('/', protect, authorize('Super Admin', 'Admin'), upsertPageSection);
router.delete('/', protect, authorize('Super Admin', 'Admin'), deletePageSection);

export default router;
