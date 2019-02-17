var express = require('express');
var router = express.Router();
var path = require('path');
var { bucket } = require('../CloudStorage/gs');
//var multer = require('../Multer/multer');
var multer = require('multer');
var util = require('util');

const upload = multer({
  storage: multer.memoryStorage()
});

router.post('/imagefile', upload.single('file'), function(req, res) {
  console.log('FILE UPLOADING ...');
  console.log('#########################');
  console.log(util.inspect(req.file, {showHidden: false, depth: null}));
  let filename = `${Date.now()}_${req.file.originalname}`;
  let fileUploading = bucket.file(filename);
  console.log('#########################');
  //console.log(util.inspect(fileUploading, {showHidden: false, depth: null}));
  let url = '';
  // establish writable stream to upload file
  const stream = fileUploading.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });
  // error handler
  stream.on('error', (err) => {
    req.file.cloudStorageError = err;
  });
  let bytesRead = 0;
	stream.on('data', function(data) {
		bytesRead += data.length;
    console.log('BYTES READ: ' + bytesRead);
	});
  stream.on('finish', () => {
    console.log('FINISHING WRITING STREAM ... ');
    req.file.cloudStorageObject = filename;
    fileUploading.makePublic().then(() => {
      req.file.cloudStoragePublicUrl = getPublicUrl(filename);
      // update url and bk doc
      url = format(`https://storage.googleapis.com/${bucket.name}/${fileUploading.name}`);
      console.log('############################');
      console.log('URL: ' + url);
      next();
    });
  })
  //stream.end(req.file.buffer);
  console.log('BUCKET!');
});

module.exports = router;
