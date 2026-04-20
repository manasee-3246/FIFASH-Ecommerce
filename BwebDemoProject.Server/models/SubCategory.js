import mongoose from "mongoose";

const SubCategorySchema =
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },
  });

export default mongoose.model(
  "SubCategory",
  SubCategorySchema
);