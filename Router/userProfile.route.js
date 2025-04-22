const express = require("express");
const {
  getUserProfileById,
  createUserProfile,
  deleteUserProfile,
  getAllUserProfiles,
  updateUserProfile,
} = require("../controller/userProfile.controller");
const verifyToken = require("../middleware/verifyToken");
const uploads = require("../middleware/upload");

const router = express.Router();

// GET all user profiles
router.get("/", verifyToken, getAllUserProfiles);

// GET a user profile by userId
router.get("/:userId", verifyToken, getUserProfileById);

// CREATE a user profile
router.post(
  "/",
  verifyToken,
  uploads.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "aadhaarFront", maxCount: 1 },
    { name: "aadhaarBack", maxCount: 1 },
    { name: "panCard", maxCount: 1 },
    { name: "driversLicense", maxCount: 1 },
  ]),
  createUserProfile
);

// UPDATE a user profile
router.patch(
  "/:userId",
  verifyToken,
  uploads.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "aadhaarFront", maxCount: 1 },
    { name: "aadhaarBack", maxCount: 1 },
    { name: "panCard", maxCount: 1 },
    { name: "driversLicense", maxCount: 1 },
  ]),
  updateUserProfile
);

// DELETE a user profile
router.delete("/:Id", verifyToken, deleteUserProfile);

module.exports = router;
