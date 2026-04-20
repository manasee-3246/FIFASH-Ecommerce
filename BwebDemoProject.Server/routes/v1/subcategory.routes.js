import express from "express";
const router = express.Router();

import SubCategory from "../../models/SubCategory.js";


// GET
router.get("/subcategories", async (req, res) => {
  const data = await SubCategory.find();

  res.json(data);
});


// ADD
router.post("/subcategories/add", async (req, res) => {
  const data = new SubCategory(req.body);

  await data.save();

  res.json(data);
});


// UPDATE
router.put("/subcategories/:id", async (req, res) => {
  const updated =
    await SubCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

  res.json(updated);
});


// DELETE
router.delete(
  "/subcategories/:id",
  async (req, res) => {
    await SubCategory.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Deleted Successfully",
    });
  }
);

export default router;