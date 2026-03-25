const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Score = require('./models/Score');
const Draw = require('./models/Draw');
const Winner = require('./models/Winner');

const seedFullDemo = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // 1. Create a Winner User
  const email = 'winner@golf.com';
  let user = await User.findOne({ email });
  if (!user) {
    const hashed = await bcrypt.hash('Password123!', 10);
    user = await User.create({
      name: 'Lucky Winner',
      email,
      password: hashed,
      role: 'user',
      subscription: {
        status: 'active',
        plan: 'monthly',
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });
    console.log('✅ Winner user created');
  } else {
    // Ensure active subscription for demo
    user.subscription.status = 'active';
    await user.save();
  }

  // 2. Give the user some scores
  await Score.deleteMany({ user: user._id });
  await Score.insertMany([
    { user: user._id, scores: [10, 20, 30, 40, 45] },
    { user: user._id, scores: [5, 15, 25, 35, 42] }
  ]);
  console.log('✅ Scores added');

  // 3. Create a matching Draw (April 2026)
  await Draw.deleteMany({ month: 'April 2026' });
  const draw = await Draw.create({
    month: 'April 2026',
    winningNumbers: [10, 20, 30, 5, 8],
    status: 'published',
    type: 'random',
    totalPrizePool: 1000,
    payouts: { match5: 400, match4: 350, match3: 250 }
  });
  console.log('✅ Matching Draw created');

  // 4. Create a Pending Winner record
  await Winner.deleteMany({ user: user._id });
  const winner = await Winner.create({
    user: user._id,
    draw: draw._id,
    matchTier: 3, // Correct Type: Number
    prizeAmount: 83.33,
    status: 'pending'
  });
  console.log('✅ Pending Winner record created');

  console.log('\n🚀 Demo Data Ready!');
  console.log('User: winner@golf.com / Password123!');
  console.log('Admin: admin@golfcharity.com / Admin1234!');

  await mongoose.disconnect();
};

seedFullDemo().catch(err => {
  console.error('Seed failed:', err.message);
  mongoose.disconnect();
});
