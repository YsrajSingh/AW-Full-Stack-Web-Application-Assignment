const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  const tokenPayload = {
    _id: user._id,
    email: user.email,
    name: user.name
  };
  return jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '2d' });
};

const generateRefreshToken = (user) => {
  const tokenPayload = {
    _id: user._id,
    email: user.email
  };
  return jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken
};