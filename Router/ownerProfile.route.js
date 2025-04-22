const express = require("express");
const {
  getOwnerProfileById,
  createOwnerProfile,
  deleteOwnerProfile,
  getAllOwnerProfiles,
  updateOwnerProfile,
} = require("../controller/ownerProfile.controller");
const verifyToken = require("../middleware/verifyToken");
const uploads = require("../middleware/upload");

const router = express.Router();

// GET all owner profiles
router.get("/", verifyToken, getAllOwnerProfiles);

// GET single owner profile by ID
router.get("/:ownerId", verifyToken, getOwnerProfileById);

// CREATE owner profile
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
  createOwnerProfile
);

// UPDATE owner profile
router.patch(
  "/:ownerId",
  verifyToken,
  uploads.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "aadhaarFront", maxCount: 1 },
    { name: "aadhaarBack", maxCount: 1 },
    { name: "panCard", maxCount: 1 },
    { name: "driversLicense", maxCount: 1 },
  ]),
  updateOwnerProfile
);

// DELETE owner profile
router.delete("/:Id", verifyToken, deleteOwnerProfile);

module.exports = router;
