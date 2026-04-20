import mongoose from 'mongoose';
import EmailTemplate from '../models/EmailTemplate.js';
import dotenv from 'dotenv';

dotenv.config();

async function fixTemplates() {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log('Connected to DB');

    const templates = await EmailTemplate.find({ 
      isActive: true 
    });

    for (const template of templates) {
      let updated = false;
      let newSignature = template.emailSignature;

      // Replace hardcoded name Manasee with USERNAME placeholder
      if (newSignature.includes('{{Manasee}}')) {
        console.log(`Fixing NAME placeholder in template: ${template.templateName}`);
        newSignature = newSignature.replace(/{{Manasee}}/g, '{{USERNAME}}');
        updated = true;
      }

      // Replace any 6-digit number inside double curly braces with {{OTP_CODE}}
      if (/{{\s*\d{6}\s*}}/.test(newSignature)) {
        console.log(`Fixing OTP placeholder in template: ${template.templateName}`);
        newSignature = newSignature.replace(/{{\s*\d{6}\s*}}/g, '{{OTP_CODE}}');
        updated = true;
      }
      
      // Also check for common patterns if specific ones aren't found
      // (e.g. any 6-digit number inside curly braces)
      if (!updated && /{{\d{6}}}/.test(newSignature)) {
         console.log(`Fixing pattern-matched OTP placeholder in template: ${template.templateName}`);
         newSignature = newSignature.replace(/{{\d{6}}}/g, '{{OTP_CODE}}');
         updated = true;
      }

      if (updated) {
        template.emailSignature = newSignature;
        await template.save();
        console.log(`✅ Template "${template.templateName}" updated successfully.`);
      }
    }

    await mongoose.disconnect();
    console.log('Disconnected from DB');
  } catch (err) {
    console.error('Error fixing templates:', err);
  }
}

fixTemplates();
