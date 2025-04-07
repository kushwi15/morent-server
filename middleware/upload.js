const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Try multiple ways to get userId
    const userId = req.user?._id || req.body?.userId || req.params?.userId;
    
    if (!userId) {
      return cb(new Error("User ID is required for file uploads"), null);
    }

    const uploadDir = path.join(__dirname, "../uploads", userId);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const allowedExt = [".jpg", ".jpeg", ".png"];
    const originalExt = path.extname(file.originalname).toLowerCase();

    if (!allowedExt.includes(originalExt)) {
      return cb(new Error("Only JPG, JPEG, and PNG files are allowed"), null);
    }

    const fileNameMap = {
      profilePic: `profile-pic${originalExt}`,
      aadhaarFront: `aadhaar-front${originalExt}`,
      aadhaarBack: `aadhaar-back${originalExt}`,
      panCard: `pancard${originalExt}`,
      passport: `passport${originalExt}`,
      driversLicense: `drivers-license${originalExt}`,
    };

    const fileName = fileNameMap[file.fieldname] || `other-${Date.now()}${originalExt}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, and PNG files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;