import mongoose from "mongoose";
const connectDB = async () => {
    await mongoose.connect("mongodb://localhost:27017/formDB")
    console.log("MongoDB connected")
};
export default connectDB;