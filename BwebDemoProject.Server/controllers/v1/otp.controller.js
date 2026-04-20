import Otp from "../../models/Otp.js";
import Employee from "../../models/Employee.js";
import CompanyMaster from "../../models/CompanyMaster.js";
import EmailTemplate from "../../models/EmailTemplate.js";
import EmailFor from "../../models/EmailFor.js";
import User from "../../models/User.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { randomInt } from "crypto";

export const createOtp = async (req, res) => {
  try {
    const { email, purpose } = req.body;

    let user = null;

    if (purpose !== "registration") {
      user = await Employee.findOne({ emailOffice: email });

      if (!user) {
        user = await CompanyMaster.findOne({ email });
      }

      if (!user) {
        return res.status(400).json({
          isOk: false,
          message: "User not found",
        });
      }
    } else {
      // For registration, check if user already exists in User model
      user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          isOk: false,
          message: "User already exists with this email",
        });
      }
    }

    // Check if an OTP was recently sent (within the last minute)
    const existingOtp = await Otp.findOne({ email });
    let previousOtpValue = null;

    if (existingOtp) {
      previousOtpValue = existingOtp.otp;
      const timeDiff = Date.now() - existingOtp.createdAt.getTime();
      const cooldownPeriod = 60 * 1000; // 1 minute in milliseconds

      if (timeDiff < cooldownPeriod) {
        const remainingTime = Math.ceil((cooldownPeriod - timeDiff) / 1000);
        return res.status(429).json({
          isOk: false,
          message: `Please wait ${remainingTime} seconds before requesting a new OTP`,
          remainingTime: remainingTime,
        });
      }

      // Delete the previous OTP if it exists and cooldown has passed
      await Otp.deleteOne({ email });
    }

    // Generate Unique OTP
    let otp = randomInt(100000, 1000000).toString();
    
    // Ensure the new OTP is different from the previous one (if any)
    while (otp === previousOtpValue) {
      otp = randomInt(100000, 1000000).toString();
    }

    // Create new OTP
    await Otp.create({
      email,
      otp,
      createdAt: new Date(),
    });

    // Find email template
    const templateTypeName = purpose === "registration" ? "Registration" : "Forget Password";
    const emailType = await EmailFor.findOne({
      emailFor: templateTypeName,
    });
    if (!emailType) {
      return res.status(404).json({
        isOk: false,
        message: "Email template type not found",
      });
    }

    // Get email template
    const emailTemplate = await EmailTemplate.findOne({
      emailFor: emailType._id,
      isActive: true,
    }).populate("emailFrom");

    if (!emailTemplate) {
      return res.status(404).json({
        isOk: false,
        message: "Email template not found",
      });
    }

    // Replace template variables in email body
    let emailBody = emailTemplate.emailSignature;
    const username = (user && (user.employeeName || user.name)) || "User";
    
    // Use regular expressions with 'g' flag for global replacement
    emailBody = emailBody.replace(/{{USERNAME}}/g, username);
    emailBody = emailBody.replace(/{{OTP_CODE}}/g, otp);
    
    let emailSubject = emailTemplate.emailSubject;
    emailSubject = emailSubject.replace(/{{USERNAME}}/g, username);
    emailSubject = emailSubject.replace(/{{OTP_CODE}}/g, otp);

    // Create transporter
    let transporter;
    try {
      const smtpConfig = {
        host: emailTemplate.emailFrom.host,
        port: emailTemplate.emailFrom.port,
        secure: emailTemplate.emailFrom.SSL, // true for 465, false for other ports
        auth: {
          user: emailTemplate.emailFrom.email,
          pass: emailTemplate.emailFrom.appPassword,
        },
        tls: {
          // Do not fail on invalid certificates (common in local environments/certain SMTP hosts)
          rejectUnauthorized: false
        }
      };

      // Special handling for Gmail service if host is gmail
      if (emailTemplate.emailFrom.host.toLowerCase().includes("gmail")) {
        smtpConfig.service = "gmail";
      }

      transporter = nodemailer.createTransport(smtpConfig);

      // Send email
      await transporter.sendMail({
        from: `"${emailTemplate.mailerName}" <${emailTemplate.emailFrom.email}>`,
        to: email,
        cc: emailTemplate.emailCC || "",
        bcc: emailTemplate.emailBCC || "",
        subject: emailSubject,
        html: emailBody,
      });

      console.log(`✅ OTP Email [${otp}] sent successfully to ${email}`);

      return res.status(200).json({
        isOk: true,
        message: "OTP sent to your email",
      });
    } catch (emailError) {
      console.error("❌ SMTP Error:", emailError);
      return res.status(500).json({
        isOk: false,
        message: "Failed to send OTP email. Please check your SMTP settings in Admin Panel.",
        error: emailError.message,
      });
    }
  } catch (error) {
    console.error("Error in createOtp:", error);
    return res.status(500).json({
      isOk: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({
        isOk: false,
        message: "OTP not found or expired. Please request a new OTP.",
      });
    }

    // Check if OTP is expired (older than 10 minutes)
    const otpAge = Date.now() - otpRecord.createdAt.getTime();
    if (otpAge > 10 * 60 * 1000) {
      // 10 minutes in milliseconds
      // Delete expired OTP
      await Otp.deleteOne({ email });

      return res.status(400).json({
        isOk: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Standardize input (trim whitespace)
    const submittedOtp = otp ? otp.toString().trim() : "";
    const storedOtp = otpRecord.otp ? otpRecord.otp.toString().trim() : "";

    if (storedOtp !== submittedOtp) {
      console.warn(`❌ OTP Mismatch for ${email}. Expected: [${storedOtp}], Received: [${submittedOtp}]`);
      return res.status(400).json({
        isOk: false,
        message: "Invalid OTP. Please check the code and try again.",
      });
    }

    // OTP is valid
    otpRecord.isVerified = true;
    await otpRecord.save();

    return res.status(200).json({
      isOk: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    return res.status(500).json({
      isOk: false,
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Verify OTP again for security
    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({
        isOk: false,
        message: "Invalid OTP",
      });
    }

    // Find user - first try with emailOffice for Employee
    let user = await Employee.findOne({ emailOffice: email });
    // let isEmployee = true;

    // If not found, try with email for CompanyMaster
    if (!user) {
      user = await CompanyMaster.findOne({ email });
      // isEmployee = false;
    }

    if (!user) {
      return res.status(400).json({
        isOk: false,
        message: "User not found",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Delete OTP after successful password reset
    await Otp.deleteOne({ email });

    return res.status(200).json({
      isOk: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({
      isOk: false,
      message: "Failed to reset password",
      error: error.message,
    });
  }
};
