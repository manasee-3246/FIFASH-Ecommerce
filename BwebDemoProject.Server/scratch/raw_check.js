import mongoose from 'mongoose';
import EmailTemplate from '../models/EmailTemplate.js';
import dotenv from 'dotenv';

dotenv.config();

async function rawCheck() {
  try {
    await mongoose.connect(process.env.DATABASE);
    const template = await EmailTemplate.findOne({ templateName: /Registration/ });
    if (template) {
      console.log('RAW SIGNATURE:');
      console.log(JSON.stringify(template.emailSignature));
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

rawCheck();
