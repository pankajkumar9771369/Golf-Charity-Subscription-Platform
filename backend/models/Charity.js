const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  events: [
    {
      title: { type: String, required: true },
      date: { type: Date, required: true },
      description: { type: String }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Charity', charitySchema);
