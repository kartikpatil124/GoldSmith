import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Banner from './models/Banner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB Connected!');
    const banners = await Banner.find({}).lean();
    console.log('Found', banners.length, 'banners:');
    banners.forEach(b => {
      console.log('ID:', b._id);
      console.log('Title:', b.title);
      console.log('PageKey:', b.pageKey);
      console.log('Position:', b.position);
      console.log('Image:', b.image);
      console.log('IsActive:', b.isActive);
      console.log('-----------------------------');
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

check();
