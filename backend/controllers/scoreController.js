const Score = require('../models/Score');
const User = require('../models/User');

const addScore = async (req, res) => {
  try {
    const { value, date } = req.body;
    
    // Ensure subscription is active or user is bypassed
    // For now assuming any authenticated user can post, but typically
    // we would check req.user.subscription.status === 'active'
    
    if (value < 1 || value > 45) {
      return res.status(400).json({ message: 'Score must be between 1 and 45' });
    }

    const newScore = await Score.create({
      user: req.user._id,
      value,
      date: date || Date.now()
    });

    // Rolling 5 logic
    const userScores = await Score.find({ user: req.user._id }).sort({ date: 1 }); // oldest first
    if (userScores.length > 5) {
      // Remove the oldest ones
      const toDelete = userScores.slice(0, userScores.length - 5);
      const toDeleteIds = toDelete.map(s => s._id);
      await Score.deleteMany({ _id: { $in: toDeleteIds } });
    }

    // Return the updated list in reverse chronological order
    const updatedScores = await Score.find({ user: req.user._id }).sort({ date: -1 });
    res.status(201).json(updatedScores);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getScores = async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user._id }).sort({ date: -1 });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addScore, getScores };
