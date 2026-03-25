const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
  drawMonth: { type: String, required: true }, // e.g., 'March 2026'
  type: { type: String, enum: ['random', 'algorithm'], default: 'random' },
  status: { type: String, enum: ['draft', 'simulated', 'published'], default: 'draft' },
  winningNumbers: { type: [Number], default: [] }, // Array of numbers
  totalPrizePool: { type: Number, default: 0 },
  jackpotRollover: { type: Number, default: 0 },
  executedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Draw', drawSchema);
