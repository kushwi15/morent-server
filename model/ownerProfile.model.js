const mongoose = require("mongoose");

const OwnerProfileSchema = new mongoose.Schema({
  ownerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dob: { type: String },
  phone: { type: String },
  email: { type: String, required: true },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  country: { type: String },
  profilePic: { type: String },
  aadhaarFront: { type: String },
  aadhaarBack: { type: String },
  panCard: { type: String },
  driversLicense: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("OwnerProfile", OwnerProfileSchema);