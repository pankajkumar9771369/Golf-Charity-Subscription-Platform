const express = require('express');
const router = express.Router();
const { createSubscription, cancelSubscription, getSubscriptionStatus, handleSubscriptionSuccess } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

router.post('/create', protect, createSubscription);
router.post('/cancel', protect, cancelSubscription);
router.get('/status', protect, getSubscriptionStatus);
router.get('/success', handleSubscriptionSuccess);

module.exports = router;
