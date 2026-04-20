import mongoose from 'mongoose';
import EmailTemplate from '../models/EmailTemplate.js';
import EmailFor from '../models/EmailFor.js';
import dotenv from 'dotenv';

dotenv.config();

async function debugTemplate() {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log('Connected to DB');

    const templates = await EmailTemplate.find({ 
      isActive: true 
    }).populate('emailFor');

    if (templates.length > 0) {
      for (const template of templates) {
        console.log(`\n--- TEMPLATE: ${template.emailFor?.emailFor} ---`);
        console.log('Subject:', template.emailSubject);
        console.log('Signature (Body):', template.emailSignature);
        
        const hasOtpPlaceholder = template.emailSignature.includes('{{OTP_CODE}}');
        const hasUserPlaceholder = template.emailSignature.includes('{{USERNAME}}');
        console.log('Contains {{OTP_CODE}}:', hasOtpPlaceholder);
        console.log('Contains {{USERNAME}}:', hasUserPlaceholder);
      }
    } else {
      console.log('No active templates found');
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

debugTemplate();
