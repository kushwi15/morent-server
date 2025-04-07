const multer = require("multer");
const asyncHandler = require("express-async-handler");
const Profile = require("../model/profile.model");
const path = require("path");
const fs = require("fs");
const uploads = require("../middleware/upload"); // Assuming this is the multer middleware setup

// CREATE PROFILE
exports.createProfile = asyncHandler(async (req, res) => {
  try {
    const { dob, address, city, state, zipCode, country } = req.body;
    const { user_id, name, phoneNumber, email } = req.user;
    const userId = user_id;

    console.log("Creating profile for User ID:", userId);
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

    res.status(201).json({
      message: "Profile created successfully",
      profile: newProfile,
    });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ error: "Failed to create profile" });
  }
});

// GET ALL PROFILES
exports.getAllProfiles = asyncHandler(async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.status(200).json(profiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ message: "Failed to fetch profiles" });
  }
});

// GET PROFILE BY USER ID
exports.getProfileById = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile by ID:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// UPDATE PROFILE
exports.updateProfile = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const { dob, address, city, state, zipCode, country } = req.body;
    const { name, phoneNumber, email } = req.user;

    console.log("Updating profile for User ID:", userId);
    console.log("Uploaded Files:", req.files);

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update text fields
    profile.name = name || profile.name;
    profile.dob = dob || profile.dob;
    profile.phone = phoneNumber || profile.phone;
    profile.email = email || profile.email;
    profile.address = address || profile.address;
    profile.city = city || profile.city;
    profile.state = state || profile.state;
    profile.zipCode = zipCode || profile.zipCode;
    profile.country = country || profile.country;

    // Update file paths only if new files are uploaded
    // In the updateProfile function, modify the profilePic handling:
    profile.profilePic = req.files?.profilePic?.[0] ? `${userId}/${req.files.profilePic[0].filename}` 
    : req.body.profilePic === '' ? null : profile.profilePic;
    profile.aadhaarFront = req.files?.aadhaarFront?.[0] ? `${userId}/${req.files.aadhaarFront[0].filename}` : profile.aadhaarFront;
    profile.aadhaarBack = req.files?.aadhaarBack?.[0] ? `${userId}/${req.files.aadhaarBack[0].filename}` : profile.aadhaarBack;
    profile.panCard = req.files?.panCard?.[0] ? `${userId}/${req.files.panCard[0].filename}` : profile.panCard;
    profile.passport = req.files?.passport?.[0] ? `${userId}/${req.files.passport[0].filename}` : profile.passport;
    profile.driversLicense = req.files?.driversLicense?.[0] ? `${userId}/${req.files.driversLicense[0].filename}` : profile.driversLicense;

    await profile.save();

    res.status(200).json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// DELETE PROFILE
exports.deleteProfile = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    await Profile.findOneAndDelete({ userId });
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ error: "Failed to delete profile" });
  }
});
