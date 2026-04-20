import express from "express";
import Size from "../../models/Size.js";

const router = express.Router();

router.get("/size", async (req, res) => {
  try {
    const sizes = await Size.find().sort({ displayOrder: 1, _id: -1 });
    res.json(sizes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/size/add", async (req, res) => {
  try {
    const size = new Size({
      sizeName: req.body.sizeName,
      sizeCode: req.body.sizeCode,
      displayOrder: req.body.displayOrder,
      isActive: req.body.isActive,
    });
    await size.save();
    res.json(size);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/size/:id", async (req, res) => {
  try {
    const updatedSize = await Size.findByIdAndUpdate(
      req.params.id,
      {
        sizeName: req.body.sizeName,
        sizeCode: req.body.sizeCode,
        displayOrder: req.body.displayOrder,
        isActive: req.body.isActive,
      },
      { new: true }
    );
    res.json(updatedSize);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/size/:id", async (req, res) => {
  try {
    await Size.findByIdAndDelete(req.params.id);
    res.json({ message: "Size deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

export default router;