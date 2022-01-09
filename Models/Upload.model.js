const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UploadSchema = new Schema({
  avatar: {
    type: String,
  },
  cloudinary_id: {
    type: String,
  },
});

const Upload = mongoose.model("upload", UploadSchema);
module.exports = Upload;
