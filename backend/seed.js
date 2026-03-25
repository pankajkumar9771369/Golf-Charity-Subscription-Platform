const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Charity = require('./models/Charity');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // --- Seed Admin User ---
  const existingAdmin = await User.findOne({ email: 'admin@golfcharity.com' });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash('Admin1234!', 10);
    await User.create({
      name: 'Platform Admin',
      email: 'admin@golfcharity.com',
      password: hashed,
      role: 'admin',
    });
    console.log('✅ Admin user created: admin@golfcharity.com / Admin1234!');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  // --- Seed Charities ---
  // Charities have been removed from the seed script as requested.
  // They should now be added directly through the Admin Dashboard UI.

  console.log('\n🎉 Seeding complete! You can now log in:');
  console.log('   URL:      http://localhost:5173/login');
  console.log('   Email:    admin@golfcharity.com');
  console.log('   Password: Admin1234!');
  console.log('   Dashboard: http://localhost:5173/admin\n');

  await mongoose.disconnect();
};

seed().catch(err => {
  console.error('Seed failed:', err.message);
  mongoose.disconnect();
});
