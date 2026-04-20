import express from "express";
const router = express.Router();

import Category from "../../models/Category.js";


// GET ALL
router.get("/categories", async (req, res) => {
  const categories = await Category.find();

  res.json(categories);
});


// ADD
router.post("/categories/add", async (req, res) => {
  const category = new Category(req.body);

  await category.save();

  res.json(category);
});


// DELETE
router.delete("/categories/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);

  res.json({
    message: "Deleted Successfully",
  });
});


// UPDATE
router.put("/categories/:id", async (req, res) => {
  const updated = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
});

export default router;