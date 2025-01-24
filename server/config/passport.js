const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserService = require('../services/userService');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${CLIENT_URL}/api/auth/google/callback`,
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await UserService.getByEmail(profile.emails[0].value);

        if (!user) {
          // Create new user if doesn't exist
          user = await UserService.create({
            email: profile.emails[0].value,
            name: profile.displayName,
            googleId: profile.id,
            password: Math.random().toString(36).slice(-8), // Random password for Google users
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserService.get(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;