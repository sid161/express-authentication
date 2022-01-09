const router = require("express").Router();
const cloudinary = require("../helpers/cloudinary");
const upload = require("../helpers/multer");
const Upload = require("../Models/Upload.model");

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    let upload = new Upload({
      avatar: result.secure_url,
      cloudinary_id: result.public_id,
    });

    await upload.save();
    res.json(upload);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
