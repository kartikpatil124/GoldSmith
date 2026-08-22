import express from 'express';
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, authorize('Super Admin', 'Admin', 'Product Manager'), createProduct);

router.route('/:id/reviews')
  .post(protect, createProductReview);

router.route('/:id')
  .get(getProductById)
  .put(protect, authorize('Super Admin', 'Admin', 'Product Manager'), updateProduct)
  .delete(protect, authorize('Super Admin', 'Admin', 'Product Manager'), deleteProduct);

export default router;
