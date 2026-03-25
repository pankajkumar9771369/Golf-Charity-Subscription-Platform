const express = require('express');
const router = express.Router();
const { getWinners, updateWinnerStatus, payWinnerWithStripe, getUserWinnings, submitProof } = require('../controllers/winnerController');
const { protect, admin } = require('../middleware/auth');

// Admin Routes
router.get('/all', protect, admin, getWinners);
router.put('/:id/status', protect, admin, updateWinnerStatus);
router.post('/:id/pay', protect, admin, payWinnerWithStripe);

const multer = require('multer');

// Configure multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${req.user._id}-${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// User Routes
router.get('/my', protect, getUserWinnings);
router.post('/:id/proof', protect, upload.single('proofImage'), submitProof);

module.exports = router;
