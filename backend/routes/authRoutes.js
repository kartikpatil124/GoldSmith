import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  setupAdmin,
  forgotPassword,
  resetPassword,
  logoutUser,
  googleLogin,
  appleLogin
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Setup admin route
router.post('/setup-admin', setupAdmin);

// Core Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', logoutUser);

// Profile & Verification Routes
router.get('/me', protect, getUserProfile);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Social Login Routes
router.post('/google', googleLogin);
router.post('/apple', appleLogin);

export default router;
