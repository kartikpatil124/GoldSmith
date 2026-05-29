import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB Connected!');
    const products = await Product.find({}).limit(5).lean();
    console.log('Found', products.length, 'products:');
    products.forEach(p => {
      console.log('ID:', p._id);
      console.log('Name:', p.name);
      console.log('Category:', p.category);
      console.log('Featured Image:', p.featuredImage);
      console.log('Images:', p.images);
      console.log('-----------------------------');
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

check();
