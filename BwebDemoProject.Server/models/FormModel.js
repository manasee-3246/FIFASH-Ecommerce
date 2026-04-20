import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
  First_name: {
    type: String,
    required: true
  },

  Last_name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address."]
  },

  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Phone number must be exactly 10 digits."]
  },

  Collage_Name: {
    type: String,
    required: true
  },

  Degree: {
    type: String,
    required: true
  },

  Semester: {
    type: Number,
    required: true
  },

  Branch: {
    type: String,
    required: true
  },

  SPI: {
    type: String,
    required: true,
    match: [/^\d+$/, "SPI must contain digits only."]
  },

  passing_year: {
    type: String,
    required: true,
    match: [/^\d{4}$/, "Passing year must be 4 digits."]
  },

  image: {
    type: String
  }

}, { timestamps: true });

export default mongoose.model("Form", formSchema);