const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT and attach user to req
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorised — no token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);   // toJSON strips password automatically
    if (!req.user) return res.status(401).json({ message: 'User no longer exists' });
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorised — invalid or expired token' });
  }
};

// Allow admins only
const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403).json({ message: 'Access denied — admins only' });
};

// Allow students only
const studentOnly = (req, res, next) => {
  if (req.user?.role === 'student') return next();
  res.status(403).json({ message: 'Access denied — students only' });
};

module.exports = { protect, adminOnly, studentOnly };
