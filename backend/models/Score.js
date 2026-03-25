const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  value: { type: Number, required: true, min: 1, max: 45 },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

// We won't use a strict unique index here, but instead handle the 5-score limit
// logic directly in the controller (deleting oldest when a 6th is added).

module.exports = mongoose.model('Score', scoreSchema);
