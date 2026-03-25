const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const Charity = require('../models/Charity');
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const charities = await Charity.find({ active: true });
    res.json(charities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const charity = await Charity.create(req.body);
    res.status(201).json(charity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const charity = await Charity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(charity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.id);
    if (charity) {
      charity.active = false;
      await charity.save();
      res.json({ message: 'Charity deactivated' });
    } else {
      res.status(404).json({ message: 'Charity not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// ... existing routes ...

// NEW: Independent Donation
router.post('/donate/:id', protect, async (req, res) => {
  try {
    console.log('Incoming Donation Request for Charity ID:', req.params.id);
    console.log('Stripe Key Present:', !!process.env.STRIPE_SECRET_KEY);
    const charity = await Charity.findById(req.params.id);
    if (!charity) {
      console.log('Charity NOT found in DB');
      return res.status(404).json({ message: 'Charity not found' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `One-off Donation to ${charity.name}`,
              description: `Thank you for your independent support!`
            },
            unit_amount: 2500, // Hardcoded $25 for demo
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/charities?donation=success`,
      cancel_url: `${process.env.FRONTEND_URL}/charities`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Donation Error:', err);
    res.status(500).json({ message: err.message });
  }
});

// NEW: Update contribution percentage
router.put('/profile/contribution', protect, async (req, res) => {
  try {
    const { contributionPct } = req.body;
    if (contributionPct < 10) return res.status(400).json({ message: 'Minimum contribution is 10%' });

    const user = await User.findById(req.user._id);
    user.charity.contributionPct = contributionPct;
    await user.save();

    res.json({ message: 'Contribution percentage updated', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
