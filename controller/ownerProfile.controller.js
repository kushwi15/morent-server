const multer = require("multer");
const asyncHandler = require("express-async-handler");
const OwnerProfile = require("../model/ownerProfile.model");
const path = require("path");
const fs = require("fs");
const uploads = require("../middleware/upload");

// CREATE PROFILE
exports.createOwnerProfile = asyncHandler(async (req, res) => {
  try {
    const { dob, address, city, state, zipCode, country } = req.body;
    const { owner_id, name, phoneNumber, email } = req.owner;
    const ownerId = owner_id;

    console.log("Creating profile for Owner ID:", ownerId);
    console.log("Uploaded Files:", req.files);

    const newOwnerProfile = new OwnerProfile({
      ownerId,
      name,
      dob,
      phone: phoneNumber,
      email,
      address,
      city,
      state,
      zipCode,
      country,
      profilePic: req.files?.profilePic?.[0] ? `${ownerId}/${req.files.profilePic[0].filename}` : null,
      aadhaarFront: req.files?.aadhaarFront?.[0] ? `${ownerId}/${req.files.aadhaarFront[0].filename}` : null,
      aadhaarBack: req.files?.aadhaarBack?.[0] ? `${ownerId}/${req.files.aadhaarBack[0].filename}` : null,
      panCard: req.files?.panCard?.[0] ? `${ownerId}/${req.files.panCard[0].filename}` : null,
      passport: req.files?.passport?.[0] ? `${ownerId}/${req.files.passport[0].filename}` : null,
      driversLicense: req.files?.driversLicense?.[0] ? `${ownerId}/${req.files.driversLicense[0].filename}` : null,
    });

    await newOwnerProfile.save();

    res.status(201).json({
      message: "Profile created successfully",
      ownerProfile: newOwnerProfile,
    });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ error: "Failed to create profile" });
  }
});

// GET ALL PROFILES
exports.getAllOwnerProfiles = asyncHandler(async (req, res) => {
  try {
    const ownerProfiles = await OwnerProfile.find();
    res.status(200).json(ownerProfiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ message: "Failed to fetch profiles" });
  }
});

// GET PROFILE BY OWNER ID
exports.getOwnerProfileById = asyncHandler(async (req, res) => {
  try {
    const { ownerId } = req.params;
    const ownerProfile = await OwnerProfile.findOne({ ownerId });

    if (!ownerProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(ownerProfile);
  } catch (error) {
    console.error("Error fetching profile by ID:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// UPDATE PROFILE
exports.updateOwnerProfile = asyncHandler(async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { dob, address, city, state, zipCode, country } = req.body;
    const { name, phoneNumber, email } = req.owner;

    console.log("Updating profile for Owner ID:", ownerId);
    console.log("Uploaded Files:", req.files);

    const ownerProfile = await OwnerProfile.findOne({ ownerId });

    if (!ownerProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update text fields
    ownerProfile.name = name || ownerProfile.name;
    ownerProfile.dob = dob || ownerProfile.dob;
    ownerProfile.phone = phoneNumber || ownerProfile.phone;
    ownerProfile.email = email || ownerProfile.email;
    ownerProfile.address = address || ownerProfile.address;
    ownerProfile.city = city || ownerProfile.city;
    ownerProfile.state = state || ownerProfile.state;
    ownerProfile.zipCode = zipCode || ownerProfile.zipCode;
    ownerProfile.country = country || ownerProfile.country;

    // Update file paths only if new files are uploaded
    // In the updateProfile function, modify the profilePic handling:
    ownerProfile.profilePic = req.files?.profilePic?.[0] ? `${ownerId}/${req.files.profilePic[0].filename}` 
    : req.body.profilePic === '' ? null : ownerProfile.profilePic;
    ownerProfile.aadhaarFront = req.files?.aadhaarFront?.[0] ? `${ownerId}/${req.files.aadhaarFront[0].filename}` : ownerProfile.aadhaarFront;
    ownerProfile.aadhaarBack = req.files?.aadhaarBack?.[0] ? `${ownerId}/${req.files.aadhaarBack[0].filename}` : ownerProfile.aadhaarBack;
    ownerProfile.panCard = req.files?.panCard?.[0] ? `${ownerId}/${req.files.panCard[0].filename}` : ownerProfile.panCard;
    ownerProfile.passport = req.files?.passport?.[0] ? `${ownerId}/${req.files.passport[0].filename}` : ownerProfile.passport;
    ownerProfile.driversLicense = req.files?.driversLicense?.[0] ? `${ownerId}/${req.files.driversLicense[0].filename}` : ownerProfile.driversLicense;

    await ownerProfile.save();

    res.status(200).json({
      message: "Profile updated successfully",
      ownerProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// DELETE PROFILE
exports.deleteOwnerProfile = asyncHandler(async (req, res) => {
  try {
    const { ownerId } = req.params;
    await OwnerProfile.findOneAndDelete({ ownerId });
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ error: "Failed to delete profile" });
  }
});
