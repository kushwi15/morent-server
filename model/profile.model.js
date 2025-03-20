const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true },
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
  passport: { type: String },
  driversLicense: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Profile", ProfileSchema);
