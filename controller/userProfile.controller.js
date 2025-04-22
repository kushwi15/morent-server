const multer = require("multer");
const asyncHandler = require("express-async-handler");
const UserProfile = require("../model/userProfile.model");
const path = require("path");
const fs = require("fs");
const uploads = require("../middleware/upload"); // Assuming this is the multer middleware setup

// CREATE PROFILE
exports.createUserProfile = asyncHandler(async (req, res) => {
  try {
    const { dob, address, city, state, zipCode, country } = req.body;
    const { user_id, name, phoneNumber, email } = req.user;
    const userId = user_id;

    console.log("Creating profile for User ID:", userId);
    console.log("Uploaded Files:", req.files);

    const newUserProfile = new UserProfile({
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

    await newUserProfile.save();

    res.status(201).json({
      message: "Profile created successfully",
      userProfile: newUserProfile,
    });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ error: "Failed to create profile" });
  }
});

// GET ALL PROFILES
exports.getAllUserProfiles = asyncHandler(async (req, res) => {
  try {
    const userProfiles = await UserProfile.find();
    res.status(200).json(profiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ message: "Failed to fetch profiles" });
  }
});

// GET PROFILE BY USER ID
exports.getUserProfileById = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const userProfile = await UserProfile.findOne({ userId });

    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Error fetching profile by ID:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// UPDATE PROFILE
exports.updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const { dob, address, city, state, zipCode, country } = req.body;
    const { name, phoneNumber, email } = req.user;

    console.log("Updating profile for User ID:", userId);
    console.log("Uploaded Files:", req.files);

    const userProfile = await UserProfile.findOne({ userId });

    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update text fields
    userProfile.name = name || userProfile.name;
    userProfile.dob = dob || userProfile.dob;
    userProfile.phone = phoneNumber || userProfile.phone;
    userProfile.email = email || userProfile.email;
    userProfile.address = address || userProfile.address;
    userProfile.city = city || userProfile.city;
    userProfile.state = state || userProfile.state;
    userProfile.zipCode = zipCode || userProfile.zipCode;
    userProfile.country = country || userProfile.country;

    // Update file paths only if new files are uploaded
    // In the updateProfile function, modify the profilePic handling:
    userProfile.profilePic = req.files?.profilePic?.[0] ? `${userId}/${req.files.profilePic[0].filename}` 
    : req.body.profilePic === '' ? null : userProfile.profilePic;
    userProfile.aadhaarFront = req.files?.aadhaarFront?.[0] ? `${userId}/${req.files.aadhaarFront[0].filename}` : userProfile.aadhaarFront;
    userProfile.aadhaarBack = req.files?.aadhaarBack?.[0] ? `${userId}/${req.files.aadhaarBack[0].filename}` : userProfile.aadhaarBack;
    userProfile.panCard = req.files?.panCard?.[0] ? `${userId}/${req.files.panCard[0].filename}` : userProfile.panCard;
    userProfile.passport = req.files?.passport?.[0] ? `${userId}/${req.files.passport[0].filename}` : userProfile.passport;
    userProfile.driversLicense = req.files?.driversLicense?.[0] ? `${userId}/${req.files.driversLicense[0].filename}` : userProfile.driversLicense;

    await userProfile.save();

    res.status(200).json({
      message: "Profile updated successfully",
      userProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// DELETE PROFILE
exports.deleteUserProfile = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    await UserProfile.findOneAndDelete({ userId });
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ error: "Failed to delete profile" });
  }
});
