import mongoose from 'mongoose';
import EmailFor from './models/EmailFor.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.DATABASE; 

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const registrationEmailFor = await EmailFor.findOne({ emailFor: 'Registration' });
    if (!registrationEmailFor) {
      await EmailFor.create({ emailFor: 'Registration', isActive: true });
      console.log('Created Registration EmailFor record');
    } else {
      console.log('Registration EmailFor record already exists');
    }

    const forgetPasswordEmailFor = await EmailFor.findOne({ emailFor: 'Forget Password' });
    if (!forgetPasswordEmailFor) {
      await EmailFor.create({ emailFor: 'Forget Password', isActive: true });
      console.log('Created Forget Password EmailFor record');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
