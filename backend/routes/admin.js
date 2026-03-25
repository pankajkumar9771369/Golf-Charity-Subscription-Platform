const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const User = require('../models/User');

// Get all users
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).populate('charity.charityId');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user manually
router.put('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      if (req.body.subscriptionStatus) {
        user.subscription.status = req.body.subscriptionStatus;
      }
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
