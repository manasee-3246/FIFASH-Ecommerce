import express from "express";
import {
  submitForm,
  getForms,
  updateForm,
  deleteForm,
} from "../controllers/formController.js";

const router = express.Router();

router.get("/", getForms);
router.post("/submit", submitForm);
router.put("/:id", updateForm);
router.delete("/:id", deleteForm);

export default router;
