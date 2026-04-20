import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(
  {
    sizeName: {
      type: String,
      required: true,
    },
    sizeCode: {
      type: String,
      required: true,
    },
    displayOrder: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Size", sizeSchema);