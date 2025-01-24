const express = require('express');
const passport = require('passport');
const { generateAccessToken, generateRefreshToken } = require('../utils/auth');
const UserService = require('../services/userService');

const router = express.Router();

// Google OAuth login route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get('/google/callback', passport.authenticate('google', { session: false }), async (req, res) => {
  try {
    const existingUser = await UserService.getByEmail(req.user.email);

    if (existingUser) {
      if (existingUser.authMethod === 'email') {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=This email is registered with email/password login. Please use email/password login.`);
      }
    }

    req.user.authMethod = 'google';
    const accessToken = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user);
    req.user.refreshToken = refreshToken;
    await req.user.save();

    res.redirect(`${process.env.CLIENT_URL}/oauth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  } catch (error) {
    res.redirect(`${process.env.CLIENT_URL}/login?error=${error.message}`);
  }
});

module.exports = router;
