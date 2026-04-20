import mongoose from 'mongoose';
import EmailSetup from './models/EmailSetup.js';
import EmailTemplate from './models/EmailTemplate.js';
import EmailFor from './models/EmailFor.js';
import dotenv from 'dotenv';

dotenv.config();

async function check() {
  try {
    await mongoose.connect(process.env.DATABASE);
    
    console.log('--- CHECKING EMAIL FOR ---');
    const emailFor = await EmailFor.findOne({ emailFor: 'Registration' });
    console.log('Registration Category:', JSON.stringify(emailFor, null, 2));

    if (emailFor) {
      console.log('\n--- CHECKING EMAIL TEMPLATE ---');
      const template = await EmailTemplate.findOne({ 
        emailFor: emailFor._id,
        isActive: true 
      }).populate('emailFrom');
      
      if (template) {
        console.log('Active Registration Template found!');
        console.log('Mailer Name:', template.mailerName);
        console.log('Email From:', template.emailFrom?.email);
        console.log('SMTP Host:', template.emailFrom?.host);
        console.log('SMTP Port:', template.emailFrom?.port);
        console.log('SSL:', template.emailFrom?.SSL);
        console.log('Has App Password:', !!template.emailFrom?.appPassword);
      } else {
        console.log('❌ No active Registration template found!');
      }
    } else {
      console.log('❌ Registration category not found in EmailFor!');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

check();
