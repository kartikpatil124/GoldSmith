import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import CustomRequest from './models/CustomRequest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI;

async function run() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    console.log('Finding custom requests for "lucky Patil"...');
    const docs = await CustomRequest.find({ name: { $regex: /lucky/i } }).lean();
    console.log(`Found ${docs.length} documents:`);
    docs.forEach((doc, i) => {
      console.log(`\nDocument ${i + 1}:`);
      console.log(JSON.stringify(doc, null, 2));
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
