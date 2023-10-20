const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Uploads/");
  },

  filename: (req, file, cb) => {
    const filename =
      Math.round(Math.random() * 1e9) +
      "-" +
      Date.now() +
      path.extname(file.originalname);
    cb(null, filename);
  },
});

const upload = multer({
  limits: { fileSize: 1000000 * 100 },
  storage: storage,
});

module.exports = upload;
