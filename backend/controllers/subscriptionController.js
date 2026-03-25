const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createSubscription = async (req, res) => {
  const { plan } = req.body;
  if (!['monthly', 'yearly'].includes(plan)) {
    return res.status(400).json({ message: 'Invalid plan' });
  }

  const priceAmt = plan === 'monthly' ? 1000 : 10000;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: `Golf Charity Platform - ${plan.toUpperCase()} Plan` },
          unit_amount: priceAmt,
          recurring: { interval: plan === 'monthly' ? 'month' : 'year' },
        },
        quantity: 1,
      }],
      client_reference_id: req.user._id.toString(),
      success_url: `${process.env.BACKEND_URL}/api/subscriptions/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard?canceled=true`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const handleSubscriptionSuccess = async (req, res) => {
  const { session_id, plan } = req.query;
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === 'paid') {
      const renewalDate = new Date();
      if (plan === 'monthly') renewalDate.setMonth(renewalDate.getMonth() + 1);
      else renewalDate.setFullYear(renewalDate.getFullYear() + 1);

      await User.findByIdAndUpdate(session.client_reference_id, {
        'subscription.status': 'active',
        'subscription.plan': plan,
        'subscription.renewalDate': renewalDate,
        'subscription.stripeCustomerId': session.customer,
        'subscription.stripeSubscriptionId': session.subscription
      });
      res.redirect(`${process.env.FRONTEND_URL}/dashboard?success=true`);
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/dashboard?canceled=true`);
    }
  } catch (err) {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=true`);
  }
};

const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.subscription.status = 'cancelled';
    await user.save();
    res.json({ message: 'Subscription cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ subscription: user.subscription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSubscription, handleSubscriptionSuccess, cancelSubscription, getSubscriptionStatus };
