// const multer = require('multer');
// const path = require('path');

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname)); // Append extension
//   }
// });

// // Initialize multer upload
// const upload = multer({ storage: storage });

// module.exports = { upload };


const fs = require('fs');
const path = require('path');

// Path to the uploads directory
const uploadDir = path.join(__dirname, '../uploads');

// Check if the directory exists, if not create it
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Uploads directory created!');
}

// Your multer configuration
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save files to the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append extension
  }
});

const upload = multer({ storage: storage });

module.exports = { upload };
