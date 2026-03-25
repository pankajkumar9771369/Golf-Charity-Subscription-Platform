const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  subscription: {
    status: { type: String, enum: ['active', 'inactive', 'lapsed', 'cancelled'], default: 'inactive' },
    plan: { type: String, enum: ['monthly', 'yearly', 'none'], default: 'none' },
    renewalDate: { type: Date },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String }
  },
  charity: {
    charityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Charity' },
    contributionPct: { type: Number, default: 10, min: 10, max: 100 }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
