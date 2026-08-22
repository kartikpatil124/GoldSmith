import express from 'express';
import {
  getCollections,
  getAllCollectionsAdmin,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
  assignProductToCollection,
  removeProductFromCollection,
  reorderCollectionProducts,
} from '../controllers/collectionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCollections);
router.get('/admin', protect, authorize('Super Admin', 'Admin'), getAllCollectionsAdmin);
router.post('/', protect, authorize('Super Admin', 'Admin'), createCollection);
router.get('/:slug', getCollectionBySlug);
router.put('/:id', protect, authorize('Super Admin', 'Admin'), updateCollection);
router.delete('/:id', protect, authorize('Super Admin', 'Admin'), deleteCollection);
router.post('/:id/products', protect, authorize('Super Admin', 'Admin'), assignProductToCollection);
router.delete('/:id/products/:productId', protect, authorize('Super Admin', 'Admin'), removeProductFromCollection);
router.put('/:id/reorder', protect, authorize('Super Admin', 'Admin'), reorderCollectionProducts);

export default router;
