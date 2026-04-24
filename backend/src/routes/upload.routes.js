const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl: req.file.path // Cloudinary secure URL
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

module.exports = router;
