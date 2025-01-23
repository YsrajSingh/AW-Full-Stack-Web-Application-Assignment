const express = require('express');
const UserService = require('../services/userService.js');
const { requireUser } = require('./middleware/auth.js');
const { generateAccessToken, generateRefreshToken } = require('../utils/auth.js');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/email.js');

const router = express.Router();

router.post('/login', async (req, res) => {
  const sendError = msg => res.status(400).json({ message: msg });
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError('Email and password are required');
  }

  const user = await UserService.authenticateWithPassword(email, password);

  if (user) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();
    return res.json({...user.toObject(), accessToken});
  } else {
    return sendError('Email or password is incorrect');

  }
});

router.post('/register', async (req, res, next) => {
  if (req.user) {
    return res.json({ user: req.user });
  }
  try {
    const user = await UserService.create(req.body);
    return res.status(200).json(user);
  } catch (error) {
    console.error(`Error while registering user: ${error}`);
    return res.status(400).json({ error });
  }
});

router.post('/logout', requireUser, async (req, res) => {
  try {
    console.log(`Attempting to logout user: ${req.user._id}`);
    const user = await UserService.get(req.user._id);
    if (!user) {
      console.error(`User not found for ID: ${req.user._id}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Invalidate refresh token
    user.refreshToken = null;
    await user.save();
    console.log(`Successfully logged out user: ${req.user._id}`);

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token is required'
    });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find the user
    const user = await UserService.get(decoded._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(403).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Update user's refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save();

    // Return new tokens
    return res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });

  } catch (error) {
    console.error(`Token refresh error: ${error.message}`);

    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        success: false,
        message: 'Refresh token has expired'
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

router.get('/me', requireUser, async (req, res) => {
  return res.status(200).json(req.user);
});

router.post('/forgot-password', async (req, res) => {
  try {
    console.log('Received forgot password request');
    const { email } = req.body;
    
    if (!email) {
      throw new Error('Email is required');
    }

    const resetToken = await UserService.createPasswordResetToken(email);
    console.log(`Generated reset token for email: ${email}`);

    const resetURL = `${req.protocol}://localhost:5173/reset-password/${resetToken}`;

    await sendEmail({
      to: email,
      subject: 'Your password reset token (valid for 30 min)',
      text: `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`,
      html: `
        <p>Forgot your password?</p>
        <p>Click <a href="${resetURL}">here</a> to reset your password.</p>
        <p>If you didn't forget your password, please ignore this email!</p>
      `
    });
    console.log(`Reset password email sent to: ${email}`);

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.post('/reset-password/:token', async (req, res) => {
  try {
    console.log('Received password reset request');
    const { password } = req.body;
    const { token } = req.params;

    if (!password) {
      throw new Error('New password is required');
    }

    if (!token) {
      throw new Error('Reset token is required');
    }

    const user = await UserService.resetPassword(token, password);
    console.log(`Password reset successful for user: ${user._id}`);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({
      status: 'success',
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;