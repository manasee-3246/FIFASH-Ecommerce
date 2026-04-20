import express from "express";
import { register, login } from "../../controllers/v1/auth.controller.js";
import { loginValidation, userRegisterValidation } from "../../middlewares/inputValidator.js";

const router = express.Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", userRegisterValidation, register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Log in user
 * @access  Public
 */
router.post("/login", loginValidation, login);

export default router;
