import mongoose from 'mongoose';
import CompanyMaster from './models/CompanyMaster.js';
import dotenv from 'dotenv';

dotenv.config();

async function check() {
  try {
    await mongoose.connect(process.env.DATABASE);
    const company = await CompanyMaster.findOne({ isSuperAdmin: false });
    if (company) {
      console.log('--- DATABASE CHECK ---');
      console.log('Company:', company.companyName);
      console.log('isEmailVerificationRequired:', company.isEmailVerificationRequired);
    } else {
      console.log('No company record found.');
    }
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

check();
