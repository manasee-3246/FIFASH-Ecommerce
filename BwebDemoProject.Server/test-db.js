import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbURI = process.env.DATABASE;

console.log("Connecting to:", dbURI);

try {
  await mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  });
  console.log("✅ DB connected");
  
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));
  
  const Product = mongoose.model("Product", new mongoose.Schema({ name: String }));
  const count = await Product.countDocuments();
  console.log("Product count:", count);
  
  process.exit(0);
} catch (err) {
  console.error("❌ DB Connection Error =>", err);
  process.exit(1);
}
