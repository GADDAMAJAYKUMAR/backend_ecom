const { User } = require('./models');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { connectDB } = require('./config/sequelize');

async function createAdmin() {
  await connectDB();

  const hashedPassword = await bcrypt.hash('admin123', 12);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: hashedPassword,
    role: 'admin',
    isActive: true
  });

  console.log('Admin user created:', admin.email);
  process.exit(0);
}

createAdmin().catch(console.error);