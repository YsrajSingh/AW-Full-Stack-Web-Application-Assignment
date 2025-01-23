const express = require('express');
const passport = require('passport');
const { generateAccessToken, generateRefreshToken } = require('../utils/auth');

const router = express.Router();

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    try {
      const accessToken = generateAccessToken(req.user);
      const refreshToken = generateRefreshToken(req.user);

      // Store refresh token
      req.user.refreshToken = refreshToken;
      req.user.save();

      // Redirect to frontend with tokens
      res.redirect(`${process.env.CLIENT_URL}/oauth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    } catch (error) {
      res.redirect(`${process.env.CLIENT_URL}/login?error=${error.message}`);
    }
  }
);

module.exports = router;