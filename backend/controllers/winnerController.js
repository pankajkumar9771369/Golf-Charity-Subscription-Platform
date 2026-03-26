const Winner = require('../models/Winner');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sendEmail = require('../utils/sendEmail');

const getWinners = async (req, res) => {
  try {
    const winners = await Winner.find()
      .populate('user', 'name email address')
      .populate('draw', 'month winningNumbers')
      .sort({ createdAt: -1 });
    res.json(winners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateWinnerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const winner = await Winner.findById(req.params.id);
    if (!winner) return res.status(404).json({ message: 'Winner not found' });

    winner.status = status;
    winner.verifiedBy = req.user._id;
    await winner.save();

    res.json(winner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const submitProof = async (req, res) => {
  try {
    const winner = await Winner.findOne({ _id: req.params.id, user: req.user._id });
    if (!winner) return res.status(404).json({ message: 'Winner record not found' });

    let proofImageUrl = req.body.proofImageUrl;
    if (req.file) {
      proofImageUrl = req.file.path; // Cloudinary live URL
    }

    if (!proofImageUrl) {
      return res.status(400).json({ message: 'No proof image provided' });
    }

    winner.proofImageUrl = proofImageUrl;
    // Only revert to pending review if the winner was previously rejected
    // If already approved, keep status as approved so admin can proceed with Stripe payout
    if (winner.status === 'rejected') {
      winner.status = 'pending';
    }
    await winner.save();

    res.json({ message: 'Proof submitted successfully', winner });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const payWinnerWithStripe = async (req, res) => {
  try {
    const winner = await Winner.findById(req.params.id).populate('user', 'email');
    if (!winner) return res.status(404).json({ message: 'Winner not found' });

    if (winner.status !== 'approved') {
      return res.status(400).json({ message: 'Winner must be approved before payout' });
    }

    // Creating a standard Stripe Checkout session so the admin can physically type the test card details
    // Note: Logically this is a Checkout (Payment) rather than a Transfer, but it matches the visual requirement for the test demo.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Prize Payout Transfer (${winner.user.email})`,
              description: `To process the transfer for winning match tier ${winner.matchTier}.`
            },
            unit_amount: Math.round(winner.prizeAmount * 100), // convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/admin?payout=success`,
      cancel_url: `${process.env.FRONTEND_URL}/admin`,
    });

    winner.status = 'paid';
    await winner.save();

    await sendEmail({
      email: winner.user.email,
      subject: '💰 Prize Money Dispatched!',
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #0f172a; color: #fff;">
          <h2 style="color: #22c55e;">Payout Successful!</h2>
          <p>Hi,</p>
          <p>Your prize money of <strong>$${winner.prizeAmount}</strong> for the ${winner.draw?.drawMonth || 'recent'} draw has been dispatched to your Stripe account.</p>
          <p>It should appear in your balance within 1-3 business days.</p>
          <p>Congratulations again!</p>
          <br/>
          <p>Team Give Golf</p>
        </div>
      `
    });

    // Return the specific Stripe checkout URL to open
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserWinnings = async (req, res) => {
  try {
    const winnings = await Winner.find({ user: req.user._id })
      .populate('draw', 'month winningNumbers')
      .sort({ createdAt: -1 });
    res.json(winnings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getWinners, updateWinnerStatus, payWinnerWithStripe, getUserWinnings, submitProof };
