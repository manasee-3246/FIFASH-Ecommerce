import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import CompanyMaster from "../../models/CompanyMaster.js";
import Otp from "../../models/Otp.js";

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("📝 Proper Registration Attempt:", { name, email });

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // 2. Logic for Email Verification (if enabled in Admin Panel)
    const company = await CompanyMaster.findOne({ isSuperAdmin: false });
    let otpRecordId = null;
    
    if (company && company.isEmailVerificationRequired) {
      const otpRecord = await Otp.findOne({ email, isVerified: true });
      if (!otpRecord) {
        return res.status(400).json({
          success: false,
          message: "Email not verified. Please verify your email via OTP.",
        });
      }
      otpRecordId = otpRecord._id;
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    console.log("✨ User Created Successfully:", email);

    // 5. Cleanup OTP
    if (otpRecordId) {
      await Otp.deleteOne({ _id: otpRecordId });
    }

    res.status(201).json({
      success: true,
      message: "Registered Successfully",
    });
  } catch (error) {
    console.error("🔥 Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find User
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3. Generate Token using Secure Secret from .env
    const secret = process.env.USER_JWT_SECRET_KEY || process.env.ADMIN_JWT_SECRET_KEY || "fallback_secret_do_not_use";
    
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role || "user",
      },
      secret,
      {
        expiresIn: process.env.JWT_EXPIRY || "7d",
      }
    );

    // 4. Send Response (Redact password)
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: "Login successful",
      token,
      data: userResponse,
      user: userResponse // Keep compatibility with existing frontend
    });
  } catch (error) {
    console.error("🔥 Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

export default {
  register,
  login,
};
