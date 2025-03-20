const express = require("express");
const { getProfileById,createProfile,deleteProfile,getAllProfiles,updateProfile } = require("../controller/profile.controller");
const verifyToken = require("../middleware/verifyToken");
const uploads = require("../middleware/upload");

const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/", verifyToken,getAllProfiles); // Fetch all profiles
router.get("/:userId", verifyToken,getProfileById); // Fetch profile by ID
router.post("/",verifyToken,uploads.fields([
        { name: "profilePic", maxCount: 1 },
        { name: "aadhaarFront", maxCount: 1 },
        { name: "aadhaarBack", maxCount: 1 },
        { name: "panCard", maxCount: 1 },
        { name: "passport", maxCount: 1 },
        { name: "driversLicense", maxCount: 1 }
    ]),
    createProfile
);
router.put("/:userId", verifyToken, uploads.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "aadhaarFront", maxCount: 1 },
    { name: "aadhaarBack", maxCount: 1 },
    { name: "panCard", maxCount: 1 },
    { name: "passport", maxCount: 1 },
    { name: "driversLicense", maxCount: 1 }
  ]), updateProfile);

router.delete("/:id", verifyToken,deleteProfile);

module.exports = router;




