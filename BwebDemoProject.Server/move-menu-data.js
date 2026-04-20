import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbURI = process.env.DATABASE;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to DB');

  // Get all documents from menugroup
  const menuGroups = await mongoose.connection.db.collection('menugroup').find({}).toArray();

  if (menuGroups.length === 0) {
    console.log('No data found in menugroup collection');
    process.exit(0);
  }

  console.log(`Found ${menuGroups.length} documents in menugroup`);

  // Insert into menugroupmasters
  const result = await mongoose.connection.db.collection('menugroupmasters').insertMany(menuGroups);

  console.log(`Inserted ${result.insertedCount} documents into menugroupmasters`);

  // Optional: drop the old collection
  // await mongoose.connection.db.collection('menugroup').drop();
  // console.log('Dropped old menugroup collection');

  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});