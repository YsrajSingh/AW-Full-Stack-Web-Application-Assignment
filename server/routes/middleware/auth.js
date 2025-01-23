const UserService = require('../../services/userService.js');
const jwt = require('jsonwebtoken');

const requireUser = (req, res, next) => {
  console.log("Received authorization header length:", req.headers.authorization?.length);
  console.log("Authorization header preview:", req.headers.authorization?.substring(0, 50) + "...");

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Ensure the id field exists
    req.user = {
      id: decoded._id || decoded.id,
      ...decoded
    };
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Authentication required' });
  }
};

module.exports = {
  requireUser,
};