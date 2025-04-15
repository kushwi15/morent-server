const User = require("../model/user.model");
const Owner = require("../model/owner.model");
const bcrypt = require("bcryptjs");
const generateOTP = require("../utils/generateOTP");
const sendSMS = require("../utils/sendSMS");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

const getModelByRole = (role) => {
  if (role === 'owner') return Owner;
  return User;
};

const forgotPassword = async (req, res) => {
  try {
    const { email, phoneNumber, role = 'user' } = req.body;

    if (!email && !phoneNumber) {
      return res.status(400).json({ 
        success: false,
        message: "Please provide either email or phone number" 
      });
    }

    const Model = getModelByRole(role);
    const user = await Model.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(phoneNumber ? [{ phoneNumber }] : [])
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} not found with the provided credentials`
      });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    let channel;
    if (email) {
      await sendEmail(
        user.email,
        "Password Reset OTP",
        `Your password reset OTP is: ${otp}\nThis code expires in 5 minutes.`
      );
      channel = 'email';
    } else if (phoneNumber) {
      await sendSMS(
        user.phoneNumber,
        `Your password reset OTP is: ${otp}. Valid for 5 minutes.`
      );
      channel = 'sms';
    }

    return res.status(200).json({
      success: true,
      message: `OTP sent to your ${channel}`,
      channel,
      ...(process.env.NODE_ENV === 'development' && { otp })
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, phoneNumber, otp, role = 'user' } = req.body;

    if (!otp || (!email && !phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Please provide OTP and either email or phone number"
      });
    }

    const Model = getModelByRole(role);
    const user = await Model.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(phoneNumber ? [{ phoneNumber }] : [])
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} not found`
      });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const resetToken = jwt.sign(
      { userId: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      resetToken,
      userId: user._id.toString()
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while verifying OTP",
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { userId, newPassword, role = 'user' } = req.body;

    const Model = getModelByRole(role);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await Model.findByIdAndUpdate(userId, {
      password: hashedPassword,
      otp: undefined,
      otpExpiry: undefined
    });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reset password"
    });
  }
};

module.exports = {
  forgotPassword,
  verifyOTP,
  resetPassword
};
