const express = require('express');
const passport = require('passport');
const { generateAccessToken, generateRefreshToken } = require('../utils/auth');
const UserService = require('../services/userService');

const router = express.Router();

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
      // Check if the user is already registered with email/password
      const existingUser = await UserService.getByEmail(req.user.email);

      if (existingUser) {
        if (existingUser.authMethod === 'email') {
          return res.redirect(`${process.env.CLIENT_URL}/login?error=This email is registered with email/password. Please use email/password login.`);
        }
      }

      // Handle the Google login and store refresh tokens
      const accessToken = generateAccessToken(req.user);
      const refreshToken = generateRefreshToken(req.user);
      req.user.refreshToken = refreshToken;
      req.user.authMethod = 'google';
      await req.user.save();

      // Redirect to frontend with tokens
      res.redirect(`${process.env.CLIENT_URL}/oauth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    } catch (error) {
      res.redirect(`${process.env.CLIENT_URL}/login?error=${error.message}`);
    }
  }
);

module.exports = router;