import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
const imagesDir = path.join(uploadsDir, 'images');
const videosDir = path.join(uploadsDir, 'videos');
const certificatesDir = path.join(uploadsDir, 'certificates');

[uploadsDir, imagesDir, videosDir, certificatesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    let dest = imagesDir;
    if (file.mimetype.startsWith('video/')) {
      dest = videosDir;
    } else if (file.mimetype === 'application/pdf') {
      dest = certificatesDir;
    }
    cb(null, dest);
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

function checkFileType(file, cb) {
  const imageTypes = /jpg|jpeg|png|webp/;
  const videoTypes = /mp4|webm|mov/;
  const docTypes = /pdf/;

  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const isImage = imageTypes.test(ext);
  const isVideo = videoTypes.test(ext);
  const isDoc = docTypes.test(ext);

  if (isImage || isVideo || isDoc) {
    return cb(null, true);
  } else {
    cb(new Error('Allowed file types: JPG, PNG, WebP, MP4, WebM, MOV, PDF'));
  }
}

// Image upload (max 3MB per file)
const uploadImage = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const imageTypes = /jpg|jpeg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (imageTypes.test(ext)) {
      return cb(null, true);
    }
    cb(new Error('Images only: JPG, PNG, WebP'));
  },
});

// Video upload (max 20MB)
const uploadVideo = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const videoTypes = /mp4|webm|mov/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (videoTypes.test(ext)) {
      return cb(null, true);
    }
    cb(new Error('Videos only: MP4, WebM, MOV'));
  },
});

// General upload (images, videos, certificates)
const uploadGeneral = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Helper: normalize path for URL
const toUrl = (filePath) => {
  const relative = path.relative(path.join(__dirname, '..'), filePath);
  return '/' + relative.replace(/\\/g, '/');
};

// Single image upload
router.post('/', uploadGeneral.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  res.json({ success: true, data: toUrl(req.file.path) });
});

// Multiple images upload (max 8)
router.post('/gallery', uploadImage.array('images', 8), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }
  const filePaths = req.files.map(file => toUrl(file.path));
  res.json({ success: true, data: filePaths });
});

// Video upload
router.post('/video', uploadVideo.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No video uploaded' });
  }
  res.json({ success: true, data: toUrl(req.file.path) });
});

// Certificate upload
router.post('/certificate', uploadGeneral.single('certificate'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No certificate uploaded' });
  }
  res.json({ success: true, data: toUrl(req.file.path) });
});

// Error handling for multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File too large' });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
});

export default router;
