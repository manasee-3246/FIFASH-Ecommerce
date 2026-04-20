import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function check() {
  try {
    await mongoose.connect(process.env.DATABASE);
    const users = await User.find().select('name email role');
    console.log('--- USER LIST ---');
    console.log(JSON.stringify(users, null, 2));
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

check();
