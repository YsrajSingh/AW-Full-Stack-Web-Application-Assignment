const express = require('express');
const UserService = require('../services/userService');
const { generateAccessToken, generateRefreshToken } = require('../utils/auth');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/email');
const User = require('../models/User');
const passport = require('passport');

const router = express.Router();

// Login with email and password
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await UserService.authenticateWithPassword(email, password);
  if (user) {
    if (user.authMethod === 'google') {
      return res.status(400).json({ message: 'This account was registered via Google. Please log in using Google.' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    return res.json({
      ...user.toObject(),
      accessToken,
    });
  } else {
    return res.status(400).json({ message: 'Email or password is incorrect' });
  }
});

// Register user via email or Google
router.post('/register', async (req, res) => {
  try {
    const { email, password, authMethod } = req.body;

    const newUser = await UserService.create({
      email,
      password,
      authMethod: 'email',
    });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    newUser.refreshToken = refreshToken;

    await newUser.save();
    res.status(201).json({
      message: 'User registered successfully.',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Logout user
router.post('/logout', async (req, res) => {
  try {
    const { user } = req;
    user.refreshToken = null;
    await user.save();
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging out' });
  }
});

// Password reset logic
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const resetToken = await UserService.createPasswordResetToken(email);
  const resetURL = `${req.protocol}://localhost:5173/reset-password/${resetToken}`;

  await sendEmail({
    to: email,
    subject: 'Reset Your Password',
    text: `Click the following link to reset your password: ${resetURL}`,
  });

  res.status(200).json({ message: 'Password reset email sent!' });
});

router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const user = await UserService.resetPassword(token, password);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.status(200).json({
    accessToken,
    refreshToken,
    message: 'Password reset successfully',
  });
});

module.exports = router;
