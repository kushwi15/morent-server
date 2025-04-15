const User = require("../model/user.model");
const Owner = require("../model/owner.model"); // Assuming you have an Owner model
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  try {
    const { email, phoneNumber, password, role = 'user' } = req.body;

    // Validate input
    if (!password || (!email && !phoneNumber)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide email or phone number and password" 
      });
    }

    // Determine which model to use based on role
    const Model = role === 'owner' ? Owner : User;
    
    // Build query
    const query = email ? { email } : { phoneNumber };
    
    // Find user/owner with password
    const account = await Model.findOne(query).select('+password');
    
    if (!account) {
      return res.status(404).json({ 
        success: false, 
        message: `${role === 'owner' ? 'Owner' : 'User'} not found with these credentials` 
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid password" 
      });
    }

    // Create token with role information
    const token = jwt.sign(
      { 
        userId: account._id,
        role: role,
        email: account.email,
        phoneNumber: account.phoneNumber
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Prepare account data without sensitive fields
    const accountData = {
      _id: account._id,
      fullName: account.fullName,
      email: account.email,
      phoneNumber: account.phoneNumber,
      role: role
    };

    // Additional owner-specific fields if needed
    if (role === 'owner') {
      accountData.businessName = account.businessName;
      accountData.businessAddress = account.businessAddress;
      // Add any other owner-specific fields
    }

    return res.status(200).json({
      success: true,
      user: accountData,
      token,
      message: `${role === 'owner' ? 'Owner' : 'User'} login successful`
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