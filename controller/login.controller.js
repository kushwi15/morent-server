const User = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Find user by email or phone and explicitly select the password
    const user = await User.findOne({
      $or: [
        { email: new RegExp(`^${emailOrPhone}$`, "i") }, 
        { phoneNumber: emailOrPhone }
      ],
    }).select("+password");  // 👈 Fix: Ensure password is included

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user._id, email: user.email, phoneNumber: user.phoneNumber, name: user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      name: user.fullName,
      user_id: user._id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { login };
