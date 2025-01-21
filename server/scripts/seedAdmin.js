require('dotenv').config();
const { connectDB } = require('../config/database');
const UserService = require('../services/userService');

const adminEmail = 'admin@example.com';
const adminPassword = 'admin123'; // This should be changed after first login

async function seedAdmin() {
  try {
    // Connect to database
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await UserService.getByEmail(adminEmail);

    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = await UserService.create({
      email: adminEmail,
      password: adminPassword,
      name: 'Admin User'
    });

    console.log('Admin user created successfully');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('Please change the password after first login');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
    process.exit(1);
  }
}

seedAdmin();