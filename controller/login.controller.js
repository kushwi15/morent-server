const User = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;

    // Validate input
    if (!password || (!email && !phoneNumber)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide email or phone number and password" 
      });
    }

    // Build query
    const query = email ? { email } : { phoneNumber };
    
    // Find user with password
    const user = await User.findOne(query).select('+password +otp');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found with these credentials" 
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid password" 
      });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Prepare user data without sensitive fields
    const userData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber
    };

    return res.status(200).json({
      success: true,
      user: userData,
      token,
      message: "Login successful"
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

module.exports = { login };