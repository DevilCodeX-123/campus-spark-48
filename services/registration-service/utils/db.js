import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectDB = async () => {
  // 🔎 Auto-Hunt for environment variables
  if (!process.env.MONGO_URI) {
    console.log('🔎 MONGO_URI missing from current process. Searching parent directories...');
    dotenv.config({ path: path.join(__dirname, '../../../.env') });
    dotenv.config({ path: path.join(__dirname, '../../.env') });
  }

  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    console.error('❌ CRITICAL: No MONGO_URI found after searching. Please check your .env file.');
    return false;
  }

  const options = {
    dbName: 'College_connect',
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  };

  try {
    await mongoose.connect(MONGO_URI, options);
    console.log('✅ Registration Service connected to MongoDB database: College_connect');
    return true;
  } catch (err) {
    console.error(`❌ Connection failed: ${err.message}`);
    console.log('🔄 Will retry in 5 seconds...');
    return new Promise((resolve) => {
      setTimeout(async () => {
        resolve(await connectDB());
      }, 5000);
    });
  }
};

export default connectDB;
