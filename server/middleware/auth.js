const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Official = require('../models/Official');
const localStore = require('../store');

const JWT_SECRET = process.env.JWT_SECRET || 'mospi_sih_2026_secret_key_prod';

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await Official.findById(decoded.id).select('-passwordHash');
    }
    
    if (!user) {
      await localStore.initDefaultData();
      user = localStore.officials.find(u => (u._id || u.id) === decoded.id);
    }

    if (!user) {
      return res.status(401).json({ error: 'User account not found.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Access denied. Requires one of roles: ${roles.join(', ')}` });
    }
    next();
  };
};

module.exports = { requireAuth, requireRole, JWT_SECRET };
