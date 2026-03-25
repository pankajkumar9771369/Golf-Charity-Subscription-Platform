const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
  draw: { type: mongoose.Schema.Types.ObjectId, ref: 'Draw', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  matchTier: { type: Number, enum: [3, 4, 5], required: true },
  prizeAmount: { type: Number, required: true },
  proofImageUrl: { type: String }, // User uploads screenshot to verify
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'paid'], default: 'pending' },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Admin who verified
}, { timestamps: true });

module.exports = mongoose.model('Winner', winnerSchema);
