/**
 * JWT Authentication Middleware
 * Verifies JWT tokens and protects routes
 */

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.username = decoded.username;

    next();
  } catch (error) {
    console.error('❌ Token verification error:', error.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { verifyToken };
