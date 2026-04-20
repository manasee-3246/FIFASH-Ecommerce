import express from "express";
const router = express.Router();

import Product from "../../models/Product.js";
import { upload } from "../../middlewares/upload.js";


// GET PRODUCTS
router.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});


// ADD PRODUCT
router.post("/products/add", upload.single("image"), async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      image: req.file
        ? `http://localhost:7002/uploads/${req.file.filename}`
        : req.body.image || "",
    });

    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add product",
      error: error.message,
    });
  }
});


// DELETE PRODUCT
router.delete("/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);

  res.json({
    message: "Deleted Successfully",
  });
});


// UPDATE PRODUCT
router.put("/products/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    if (req.file) {
      updateData.image = `http://localhost:7002/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: "Update Failed",
      error,
    });
  }
});

export default router;
