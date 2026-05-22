import mongoose from 'mongoose';
import User from '../models/User.js';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('Error: MONGO_URI environment variable is not set. Create a .env file with MONGO_URI.');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Auto-seed admin user
    const adminExists = await User.findOne({ email: 'admin@goldsmithsjewels.com' });
    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: 'admin@goldsmithsjewels.com',
        password: 'password123',
        role: 'Super Admin'
      });
      console.log('Admin user auto-seeded: admin@goldsmithsjewels.com / password123');
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
