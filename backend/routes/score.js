const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { addScore, getScores } = require('../controllers/scoreController');

router.route('/').post(protect, addScore).get(protect, getScores);

module.exports = router;
