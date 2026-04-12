import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectDB = async () => {
  // 🔎 Auto-Hunt for environment variables
  if (!process.env.MONGO_URI) {
    dotenv.config({ path: path.join(__dirname, '../../../.env') });
    dotenv.config({ path: path.join(__dirname, '../../.env') });
  }

  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    console.error('❌ CRITICAL: No MONGO_URI found.');
    return false;
  }

  const options = {
    serverSelectionTimeoutMS: 30000, // Increase for Atlas
    connectTimeoutMS: 30000,
  };

  try {
    await mongoose.connect(MONGO_URI, options);
    console.log('✅ Synchronized with MongoDB Cluster0');
    return true;
  } catch (err) {
    console.error(`❌ Connection failed: ${err.message}`);
    // Let Mongoose handle reconnection in background
    return false;
  }
};

export default connectDB;
