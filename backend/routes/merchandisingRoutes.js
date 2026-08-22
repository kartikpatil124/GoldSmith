import express from 'express';
import {
  getHomepageConfig,
  getHomepageConfigRaw,
  updateHomepageConfig,
  assignProductToSection,
  removeProductFromSection,
  reorderSectionProducts,
} from '../controllers/merchandisingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getHomepageConfig);
router.get('/raw', protect, authorize('Super Admin', 'Admin'), getHomepageConfigRaw);
router.put('/', protect, authorize('Super Admin', 'Admin'), updateHomepageConfig);
router.post('/assign', protect, authorize('Super Admin', 'Admin'), assignProductToSection);
router.delete('/remove', protect, authorize('Super Admin', 'Admin'), removeProductFromSection);
router.put('/reorder', protect, authorize('Super Admin', 'Admin'), reorderSectionProducts);

export default router;
