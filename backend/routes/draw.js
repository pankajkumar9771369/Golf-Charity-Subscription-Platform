const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { createSimulatedDraw, publishDraw, getDraws } = require('../controllers/drawController');
const Winner = require('../models/Winner');

// Users & Admins can get draws
router.get('/', protect, getDraws);

// Admin draw controls
router.post('/simulate', protect, admin, createSimulatedDraw);
router.post('/publish/:id', protect, admin, publishDraw);

module.exports = router;
