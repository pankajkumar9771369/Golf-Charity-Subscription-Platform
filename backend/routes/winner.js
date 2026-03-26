const express = require('express');
const router = express.Router();
const { getWinners, updateWinnerStatus, payWinnerWithStripe, getUserWinnings, submitProof } = require('../controllers/winnerController');
const { protect, admin } = require('../middleware/auth');

// Admin Routes
router.get('/all', protect, admin, getWinners);
router.put('/:id/status', protect, admin, updateWinnerStatus);
router.post('/:id/pay', protect, admin, payWinnerWithStripe);

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'givegolf_proofs',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});
const upload = multer({ storage });

// User Routes
router.get('/my', protect, getUserWinnings);
router.post('/:id/proof', protect, upload.single('proofImage'), submitProof);

module.exports = router;
