import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
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
  appleLogin,
  updateUserAvatar,
  deleteUserAvatar
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure uploads/images folder exists
const uploadsDir = path.join(__dirname, '..', 'uploads', 'images');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `avatar-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Multer Config (max 2MB, images only)
const uploadAvatar = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter(req, file, cb) {
    const imageTypes = /jpg|jpeg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (imageTypes.test(ext)) {
      return cb(null, true);
    }
    cb(new Error('Images only: JPG, PNG, WebP'));
  }
}).single('avatar');

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
router.put('/avatar', protect, uploadAvatar, updateUserAvatar);
router.delete('/avatar', protect, deleteUserAvatar);

// Social Login Routes
router.post('/google', googleLogin);
router.post('/apple', appleLogin);

export default router;
