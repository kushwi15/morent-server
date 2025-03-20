const User = require("../model/user.model");

const signup = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({
      fullName,
      email,
      phoneNumber,
      password, 
    });

    await newUser.save();

    return res.status(201).json({ user_id: newUser._id, message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { signup };
