const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
  projectId: "booktree-prj",
  keyFilename: "keyfile.json"
});
const bucket = storage.bucket("booktree-prj.appspot.com");

module.exports.bucket = bucket;
