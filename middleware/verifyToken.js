const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user info to req
    req.user = {
      user_id: user._id,
      name: user.fullName,
      phoneNumber: user.phoneNumber,
      email: user.email,
    };
    console.log("middleware", req.user);
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
