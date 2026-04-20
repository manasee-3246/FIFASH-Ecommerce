import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbURI = process.env.DATABASE;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to DB');

  const plainPassword = 'AdminPass123'; // Change to your desired password
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  
  console.log('Hashed password:', hashedPassword);

  // Update the user in DB
  const CompanyMaster = mongoose.model('CompanyMaster', new mongoose.Schema({
    email: String,
    password: String,
    // other fields...
  }));

  await CompanyMaster.updateOne(
    { email: 'admin@barodaweb.net' }, // Change to your admin email
    { $set: { password: hashedPassword } }
  );

  console.log('Password updated in DB');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});