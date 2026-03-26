const Draw = require('../models/Draw');
const Score = require('../models/Score');
const User = require('../models/User');
const Winner = require('../models/Winner');
const sendEmail = require('../utils/sendEmail');

const createSimulatedDraw = async (req, res) => {
  try {
    const { drawMonth, type } = req.body;

    let winningNumbers = [];
    if (type === 'random') {
      while (winningNumbers.length < 5) {
        const num = Math.floor(Math.random() * 45) + 1;
        if (!winningNumbers.includes(num)) winningNumbers.push(num);
      }
    } else {
      // Mock Algorithmic logic: frequently played numbers
      winningNumbers = [5, 12, 18, 22, 34]; // placeholder
    }

    const activeUsers = await User.find({ 'subscription.status': 'active' });
    const totalPrizePool = activeUsers.length * 5; // e.g., $5 pool contribution per active user
    
    // Check previous jackpot
    const lastDraw = await Draw.findOne().sort({ createdAt: -1 });
    let jackpotRollover = lastDraw && lastDraw.jackpotRollover > 0 ? lastDraw.jackpotRollover : 0;

    const draw = new Draw({
      drawMonth,
      type,
      status: 'simulated',
      winningNumbers,
      totalPrizePool,
      jackpotRollover
    });

    // Save temporarily without winner commits, or save and let admin 'publish'
    await draw.save();

    res.json({ draw, potentialWinnersMsg: 'Simulation saved. Use /publish to execute winner allocation.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const publishDraw = async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.id);
    if (!draw || draw.status === 'published') return res.status(400).json({ message: 'Invalid or already published draw' });

    draw.status = 'published';
    draw.executedAt = new Date();

    const activeUsers = await User.find({ 'subscription.status': 'active' });
    let match5Winners = [], match4Winners = [], match3Winners = [];

    for (let user of activeUsers) {
      const scores = await Score.find({ user: user._id }).sort({ date: -1 }).limit(5);
      const userNumbers = scores.map(s => s.value);
      
      let matches = 0;
      userNumbers.forEach(n => { if (draw.winningNumbers.includes(n)) matches++; });

      if (matches === 5) match5Winners.push(user._id);
      else if (matches === 4) match4Winners.push(user._id);
      else if (matches === 3) match3Winners.push(user._id);
    }

    const tier5Pool = (draw.totalPrizePool * 0.40) + draw.jackpotRollover;
    const tier4Pool = draw.totalPrizePool * 0.35;
    const tier3Pool = draw.totalPrizePool * 0.25;

    let nextJackpot = 0;

    // Create winner records (use upsert to prevent duplicates if draw is re-run)
    const createWinnerSafe = (draw, user, matchTier, prizeAmount) =>
      Winner.findOneAndUpdate(
        { draw, user, matchTier },
        { $setOnInsert: { draw, user, matchTier, prizeAmount } },
        { upsert: true, new: true }
      );

    if (match5Winners.length > 0) {
      const prizePerWinner = tier5Pool / match5Winners.length;
      for (let w of match5Winners) await createWinnerSafe(draw._id, w, 5, prizePerWinner);
      draw.jackpotRollover = 0;
    } else {
      nextJackpot = tier5Pool;
      draw.jackpotRollover = nextJackpot;
    }

    if (match4Winners.length > 0) {
      const prizePerWinner = tier4Pool / match4Winners.length;
      for (let w of match4Winners) await createWinnerSafe(draw._id, w, 4, prizePerWinner);
    }

    if (match3Winners.length > 0) {
      const prizePerWinner = tier3Pool / match3Winners.length;
      for (let w of match3Winners) await createWinnerSafe(draw._id, w, 3, prizePerWinner);
    }

    await draw.save();

    // Fire Winner Notification Emails (Fire and forget)
    const populatedWinners = await Winner.find({ draw: draw._id }).populate('user', 'name email');
    populatedWinners.forEach(w => {
      sendEmail({
        email: w.user.email,
        subject: 'You won the Monthly Draw!',
        html: `<h2>Congratulations, ${w.user.name}!</h2>
               <p>Your recent scores mathematically matched ${w.matchTier} of our generated numbers!</p>
               <p>You have been allocated a prize of <strong>$${w.prizeAmount.toFixed(2)}</strong>.</p>
               <p>Please log into your dashboard immediately to submit your proof criteria to our Admin team!</p>`
      }).catch(console.error);
    });

    // 3. Send Global Notification to all active subscribers
    for (const u of activeUsers) {
      sendEmail({
        email: u.email,
        subject: `🎯 Draw Results: ${draw.drawMonth} are OUT!`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; background: #0f172a; color: #fff;">
            <h2>The ${draw.drawMonth} Results have been published!</h2>
            <p>The winning numbers are: <strong style="color: #22c55e; font-size: 1.2rem;">${draw.winningNumbers.join(', ')}</strong></p>
            <p>Log in to your dashboard to see if you've won a prize.</p>
            <a href="${process.env.FRONTEND_URL}/admin" style="display: inline-block; padding: 10px 20px; background: #5850ec; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">Check My Dashboard</a>
            <br/>
            <p>Thank you for supporting our charities!</p>
          </div>
        `
      }).catch(console.error);
    }

    res.json({
      message: 'Draw published and notifications sent',
      draw,
      match5Winners: match5Winners.length,
      match4Winners: match4Winners.length,
      match3Winners: match3Winners.length
    });
  } catch (err) {
    console.error('DRAW PUBLISH ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

const getDraws = async (req, res) => {
  const draws = await Draw.find().sort({ createdAt: -1 });
  res.json(draws);
};

module.exports = { createSimulatedDraw, publishDraw, getDraws };
