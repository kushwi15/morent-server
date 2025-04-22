const User = require("../model/user.model");
const Owner = require("../model/owner.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  try {
    const { email, phoneNumber, password, role = 'user' } = req.body;

    if (!password || (!email && !phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Please provide email or phone number and password"
      });
    }

    // Select model based on role
    const Model = role === 'owner' ? Owner : User;
    const query = email ? { email } : { phoneNumber };

    const account = await Model.findOne(query).select("+password");
    if (!account) {
      return res.status(404).json({
        success: false,
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} not found with these credentials`
      });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }

    // Prepare token payload
    const payload = {
      role,
      email: account.email,
      phoneNumber: account.phoneNumber
    };

    if (role === 'owner') {
      payload.ownerId = account._id;
    } else {
      payload.userId = account._id;
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    // Prepare account data for response
    const accountData = {
      _id: account._id,
      fullName: account.fullName,
      email: account.email,
      phoneNumber: account.phoneNumber,
      role
    };

    if (role === 'owner') {
      accountData.businessName = account.businessName;
      accountData.businessAddress = account.businessAddress;
    }

    // Return response with dynamic role key
    return res.status(200).json({
      success: true,
      [role]: accountData,
      token,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} login successful`
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
