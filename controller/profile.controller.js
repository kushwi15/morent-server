const multer = require("multer");
const asyncHandler = require("express-async-handler");
const Profile = require("../model/profile.model"); // Import Profile model
const upload = multer({ dest: "uploads/" });
const path = require("path");
const fs = require("fs");
const uploads = require("../middleware/upload");


exports.createProfile = asyncHandler(async (req, res) => {
  try {
    const { dob, address, city, state, zipCode, country } = req.body;
    const { user_id, name, phoneNumber, email } = req.user;

    const userId = user_id;
    
    console.log("User ID:", userId);
    console.log("Uploaded Files:", req.files);

    const newProfile = new Profile({
      userId,
      name,
      dob,
      phone: phoneNumber,
      email,
      address,
      city,
      state,
      zipCode,
      country,
      profilePic: req.files?.profilePic?.[0] ? `${userId}/${req.files.profilePic[0].filename}` : null,
      aadhaarFront: req.files?.aadhaarFront?.[0] ? `${userId}/${req.files.aadhaarFront[0].filename}` : null,
      aadhaarBack: req.files?.aadhaarBack?.[0] ? `${userId}/${req.files.aadhaarBack[0].filename}` : null,
      panCard: req.files?.panCard?.[0] ? `${userId}/${req.files.panCard[0].filename}` : null,
      passport: req.files?.passport?.[0] ? `${userId}/${req.files.passport[0].filename}` : null,
      driversLicense: req.files?.driversLicense?.[0] ? `${userId}/${req.files.driversLicense[0].filename}` : null,
    });

    await newProfile.save();
    res.status(201).json({ message: "Profile created successfully", profile: newProfile });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ error: "Failed to create profile" });
  }
});



// Get all profiles
exports.getAllProfiles = asyncHandler(async (req, res) => {
  const profiles = await Profile.find();
  res.json(profiles);
});

// Get profile by ID
exports.getProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update profile
exports.updateProfile = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const { dob, address, city, state, zipCode, country } = req.body;
    const { name, phoneNumber, email } = req.user;

    console.log("Updating profile for User ID:", userId);
    console.log("Uploaded Files:", req.files);

    let profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.name = name || profile.name;
    profile.dob = dob || profile.dob;
    profile.phone = phoneNumber || profile.phone;
    profile.email = email || profile.email;
    profile.address = address || profile.address;
    profile.city = city || profile.city;
    profile.state = state || profile.state;
    profile.zipCode = zipCode || profile.zipCode;
    profile.country = country || profile.country;

    profile.profilePic = req.files?.profilePic?.[0] ? `${userId}/${req.files.profilePic[0].filename}` : profile.profilePic;
    profile.aadhaarFront = req.files?.aadhaarFront?.[0] ? `${userId}/${req.files.aadhaarFront[0].filename}` : profile.aadhaarFront;
    profile.aadhaarBack = req.files?.aadhaarBack?.[0] ? `${userId}/${req.files.aadhaarBack[0].filename}` : profile.aadhaarBack;
    profile.panCard = req.files?.panCard?.[0] ? `${userId}/${req.files.panCard[0].filename}` : profile.panCard;
    profile.passport = req.files?.passport?.[0] ? `${userId}/${req.files.passport[0].filename}` : profile.passport;
    profile.driversLicense = req.files?.driversLicense?.[0] ? `${userId}/${req.files.driversLicense[0].filename}` : profile.driversLicense;

    await profile.save();
    res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});



// Delete profile
exports.deleteProfile = asyncHandler(async (req, res) => {
  await Profile.findOneAndDelete({ userId: req.params.userId });
  res.json({ message: "Profile deleted successfully" });
});