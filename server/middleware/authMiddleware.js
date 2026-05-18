// server/middleware/authMiddleware.js — JWT verification middleware (Q6)

const jwt = require('jsonwebtoken');

/**
 * Protects routes by verifying the JWT token in the Authorization header.
 * Usage: add `protect` as middleware to any route that requires login.
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if token exists and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token using our JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;   // Attach decoded user info to request
    next();               // Proceed to the route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = { protect };
