import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  subCategory: String,
  size: String,
  image: String,
});

export default mongoose.model("Product", ProductSchema);
