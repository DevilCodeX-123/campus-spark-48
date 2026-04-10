import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import College from './models/College.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI;

console.log('🚀 Starting Database Connection Test & Seed...');

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: 'College_connect' });
    console.log('✅ Connected to MongoDB successfully.');

    const colleges = [
      {
        name: 'CampusConnect Demo University',
        city: 'Technology City',
        website: 'https://demo.campusconnect.edu',
        isActive: true
      }
    ];

    for (const collegeData of colleges) {
      const exists = await College.findOne({ name: collegeData.name });
      if (!exists) {
        await new College(collegeData).save();
        console.log(`🌱 Seeded: ${collegeData.name}`);
      } else {
        console.log(`ℹ️ Already exists: ${collegeData.name}`);
      }
    }

    console.log('🏁 Seeding complete. Closing connection...');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ SEEDING FAILED:');
    console.error(err.message);
    process.exit(1);
  }
}

seed();
