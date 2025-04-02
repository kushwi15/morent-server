const express = require("express");
const router = express.Router();
const { signup } = require("../controller/signup.controller");
const { login } = require("../controller/login.controller");
const { forgotPassword, verifyOTP, resetPassword } = require("../controller/forgotPassword.controller");

// Signup Route
router.post("/signup", signup);
// Login Route
router.post("/login", login);

router.post("/forgotpassword", forgotPassword);

router.post("/verifyotp", verifyOTP);

router.post("/resetpassword", resetPassword);
// router.post('/resetpassword', verifyToken, resetPassword);

module.exports = router;
