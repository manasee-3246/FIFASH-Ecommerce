import express from "express";

import Banner from "../../models/Banner.js";

import { upload } from "../../middlewares/upload.js";

const router =
  express.Router();

router.get(
  "/banner",
  async (
    req,
    res
  ) => {
    const banner =
      await Banner.findOne({
        isActive: true,
      }).sort({ _id: -1 });

    res.json(
      banner
    );
  }
);

router.get(
  "/banner/all",
  async (
    req,
    res
  ) => {
    const banners =
      await Banner.find().sort({ _id: -1 });

    res.json(
      banners
    );
  }
);

router.post(
  "/banner/add",
  upload.single(
    "image"
  ),
  async (
    req,
    res
  ) => {
    try {
      const banner =
        new Banner({
          ...req.body,

          image: req.file
            ? `http://localhost:7002/uploads/${req.file.filename}`
            : "",
        });

      await banner.save();

      res.json(
        banner
      );
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  }
);

router.put(
  "/banner/:id",
  upload.single(
    "image"
  ),
  async (
    req,
    res
  ) => {
    try {
      const updateData =
        {
          ...req.body,
        };

      if (
        req.file
      ) {
        updateData.image =
          `http://localhost:7002/uploads/${req.file.filename}`;
      }

      const updatedBanner =
        await Banner.findByIdAndUpdate(
          req.params.id,
          updateData,
          {
            new: true,
          }
        );

      res.json(
        updatedBanner
      );
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  }
);

router.delete(
  "/banner/:id",
  async (
    req,
    res
  ) => {
    try {
      await Banner.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Banner deleted",
      });
    } catch (error) {
      res.status(500).json({
        error:
          "Failed to delete",
      });
    }
  }
);

export default router;