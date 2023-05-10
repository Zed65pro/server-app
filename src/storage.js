const multer = require("multer");

// File for image upload config
// Set up multer storage
const storage = multer.diskStorage({
  destination: "./assets/", // Set the destination folder where files will be saved
  filename: (req, file, cb) => {
    // Set the filename to be used for saving the file
    cb(null, file.originalname);
  },
});

// Create the multer upload instance
const upload = multer({ storage });
module.exports = upload;
