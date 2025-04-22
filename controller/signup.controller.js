const User = require("../model/user.model");
const Owner = require("../model/owner.model");

const signup = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;

    if (!["user", "owner"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const phoneRegex = /^\+\d{1,3}\d{6,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number format. Include country code." });
    }

    // Check if email or phone already exists in the correct model
    const existing = await (role === "owner" ? Owner : User).findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (existing) {
      return res.status(400).json({ 
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} with this email or phone already exists`
      });
    }

    let newUser = null;
    let newOwner = null;

    if (role === "owner") {
      newOwner = new Owner({ fullName, email, phoneNumber, password });
      await newOwner.save();
      return res.status(201).json({
        message: "Owner registered successfully",
        id: newOwner._id,
      });
    } else {
      newUser = new User({ fullName, email, phoneNumber, password });
      await newUser.save();
      return res.status(201).json({
        message: "User registered successfully",
        id: newUser._id,
      });
    }
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = { signup };
