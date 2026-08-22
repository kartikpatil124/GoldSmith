import express from 'express';
import { getAllContent, getContentBySection, upsertContent, deleteContent } from '../controllers/contentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllContent);

router.route('/:section')
  .get(getContentBySection)
  .put(protect, authorize('Super Admin', 'Admin'), upsertContent)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteContent);

export default router;
