import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const activateProducts = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is missing');
      process.exit(1);
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const result = await Product.updateMany(
      { status: { $ne: 'active' } },
      { $set: { status: 'active' } }
    );
    
    console.log(`Successfully activated ${result.modifiedCount} products.`);
    
    // Also, print all active products to verify
    const activeProducts = await Product.find({ status: 'active' }).select('name sku price status').lean();
    console.log('Active Products:', activeProducts);
    
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error activating products:', error);
    process.exit(1);
  }
};

activateProducts();
