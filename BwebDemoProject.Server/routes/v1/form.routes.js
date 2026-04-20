import express from "express";
import {
  submitForm,
  getForms,
  updateForm,
  deleteForm,
  searchForms,
} from "../../controllers/v1/form.controller.js";

import { upload } from "../../middlewares/upload.js";

const router = express.Router();

router.get("/", getForms);

/* SEARCH ROUTE */
router.get("/search", searchForms);

/* SUBMIT WITH IMAGE */
router.post(
  "/submit",
  upload.single("image"),
  submitForm
);

router.put("/:id", upload.single("image"), updateForm);

router.delete("/:id", deleteForm);

export default router;