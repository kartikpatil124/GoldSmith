import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import mongoose from 'mongoose';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
// import orderRoutes from './routes/orderRoutes.js'; // Disabled for inquiry-based shift
import uploadRoutes from './routes/uploadRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import customRequestRoutes from './routes/customRequestRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import merchandisingRoutes from './routes/merchandisingRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import pageContentRoutes from './routes/pageContentRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import meInquiryRoutes from './routes/meInquiryRoutes.js';
import adminInquiryRoutes from './routes/adminInquiryRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' })); // Allow images to load cross-origin
app.use(morgan('dev'));

// Static Folder for Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes); // Disabled for inquiry-based shift
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/custom-requests', customRequestRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/merchandising', merchandisingRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/page-content', pageContentRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/me/inquiries', meInquiryRoutes);
app.use('/api/admin/inquiries', adminInquiryRoutes);

// Base Route
app.get('/', (req, res) => {
  res.send('goldsmiths Jewels API is running...');
});

// Debug DB Endpoint
app.get('/api/debug-db', async (req, res) => {
  try {
    const conn = mongoose.connection;
    const dbName = conn.db ? conn.db.databaseName : 'N/A';
    const host = conn.host || 'N/A';
    
    // Check product count using the model or raw collection
    let count = 0;
    if (conn.db) {
      count = await conn.db.collection('products').countDocuments();
    }
    
    res.json({
      success: true,
      connected: conn.readyState === 1,
      host,
      dbName,
      productCount: count,
      mongoUriProvided: !!process.env.MONGO_URI,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    data: process.env.NODE_ENV === 'production' ? null : { stack: err.stack },
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
