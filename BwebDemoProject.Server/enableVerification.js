import mongoose from 'mongoose';
import CompanyMaster from './models/CompanyMaster.js';
import dotenv from 'dotenv';

dotenv.config();

async function enable() {
  try {
    await mongoose.connect(process.env.DATABASE);
    const result = await CompanyMaster.updateOne(
      { isSuperAdmin: false }, 
      { isEmailVerificationRequired: true }
    );
    console.log('--- DATABASE UPDATE ---');
    console.log('Modified Count:', result.modifiedCount);
    console.log('✅ Email Verification is now ENABLED in the database.');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

enable();
