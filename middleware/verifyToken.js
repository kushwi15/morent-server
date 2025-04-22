const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const Owner = require("../model/owner.model");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decoded); // 🔍 Log the decoded token

    if (decoded.role === "owner") {
      const ownerData = await Owner.findById(decoded.ownerId); // 🔧 Fixed key: ownerId
      if (!ownerData) {
        return res.status(404).json({ message: "Owner not found" });
      }

      req.owner = {
        owner_id: ownerData._id,
        name: ownerData.fullName,
        phoneNumber: ownerData.phoneNumber,
        email: ownerData.email,
      };

      console.log("Middleware (Owner Verified):", req.owner);
    } else {
      const userData = await User.findById(decoded.userId);
      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = {
        user_id: userData._id,
        name: userData.fullName,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
      };

      console.log("Middleware (User Verified):", req.user);
    }

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
