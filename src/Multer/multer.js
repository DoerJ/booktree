const Multer = require('multer');
// configure upload file
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    // image to be uploaded is limited as 10MB
    fileSize: 10 * 1024 * 1024
  }
});

module.exports.multer = multer;
