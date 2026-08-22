import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const reset = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is missing in .env file!');
      process.exit(1);
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully to:', mongoose.connection.host);
    
    // Delete any existing administrative user with this email to prevent stale entries
    const deleteResult = await User.deleteOne({ email: 'admin@goldsmithsjewels.com' });
    console.log('Deleted old admin records:', deleteResult);
    
    // Create new Super Admin using User model to trigger pre-save hashing
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@goldsmithsjewels.com',
      password: 'password123',
      role: 'Super Admin',
      emailVerified: true,
      authProvider: 'local'
    });
    
    console.log('Successfully auto-seeded premium administrative credentials!');
    console.log('Email:', admin.email);
    console.log('Hashed Password:', admin.password);
    console.log('Role:', admin.role);
    
    process.exit(0);
  } catch (err) {
    console.error('Error during administrative seeding reset:', err);
    process.exit(1);
  }
};

reset();
