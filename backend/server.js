const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes will be mounted here
app.use('/api/auth', require('./routes/auth'));
app.use('/uploads', express.static('uploads'));
app.use('/api/scores', require('./routes/score'));
app.use('/api/subscriptions', require('./routes/subscription'));
app.use('/api/charities', require('./routes/charity'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/draws', require('./routes/draw'));
app.use('/api/winners', require('./routes/winner'));
app.get('/health', (req, res) => res.json({ status: 'ok', message: 'Backend is running' }));

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
