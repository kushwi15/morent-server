const User = require("../model/user.model");
const bcrypt = require("bcryptjs");
const generateOTP = require("../utils/generateOTP");
const sendSMS = require("../utils/sendSMS");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const forgotPassword = async (req, res) => {
    try {
      const { email, phone } = req.body;
  
      if (!email && !phone) {
        return res.status(400).json({ message: "Please provide an email or phone number." });
      }
  
      const user = await User.findOne({ $or: [{ email }, { phoneNumber: phone }] });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpiry = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
      await user.save();
  
      if (email) {
        await sendEmail(user.email, "Password Reset OTP", `Your OTP is: ${otp}`);
      }
  
      res.status(200).json({ message: "OTP sent to your email." });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  // Verify OTP
  const verifyOTP = async (req, res) => {
    try {
      const { email, phone, otp } = req.body;
  
      const user = await User.findOne({ $or: [{ email }, { phoneNumber: phone }] });
      if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP." });
      }
  
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
  
      res.status(200).json({ message: "OTP verified. Proceed to reset password." });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  const resetPassword = async (req, res) => {
    try {
      const { email, newPassword } = req.body;
  
      const user = await User.findOne({ email }).select("+password");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = newPassword;
      
      await user.save();
      console.log("Updated Password in DB:", user.password);
  
      res.json({ message: "Password updated successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

module.exports = { forgotPassword, verifyOTP, resetPassword };
