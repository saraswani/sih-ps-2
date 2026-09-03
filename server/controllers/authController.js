const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Official = require('../models/Official');
const localStore = require('../store');
const { JWT_SECRET } = require('../middleware/auth');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, designation, department, jobRole } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    if (mongoose.connection.readyState === 1) {
      const existingUser = await Official.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'An official with this email already exists.' });
      }

      const newOfficial = new Official({
        name, email, passwordHash,
        role: role || 'official',
        designation: designation || 'Statistical Officer',
        department: department || 'National Accounts Division (NAD)',
        jobRole: jobRole || 'Statistical Officer',
        competencyScores: [
          { skill: 'Survey Design', category: 'Statistical', level: 65 },
          { skill: 'Sampling Methods', category: 'Statistical', level: 70 },
          { skill: 'National Accounts', category: 'Statistical', level: 50 },
          { skill: 'Price Statistics', category: 'Statistical', level: 60 },
          { skill: 'Python', category: 'Technical', level: 40 },
          { skill: 'SQL', category: 'Technical', level: 65 }
        ]
      });

      await newOfficial.save();

      const token = jwt.sign({ id: newOfficial._id, role: newOfficial.role }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({
        message: 'Official registered successfully',
        token,
        user: { id: newOfficial._id, name: newOfficial.name, email: newOfficial.email, role: newOfficial.role, designation: newOfficial.designation, department: newOfficial.department, jobRole: newOfficial.jobRole }
      });
    } else {
      // In-Memory Fallback
      await localStore.initDefaultData();
      const existing = localStore.officials.find(u => u.email === email);
      if (existing) {
        return res.status(400).json({ error: 'An official with this email already exists.' });
      }

      const newOfficial = {
        _id: 'off_' + Date.now(),
        name, email, passwordHash,
        role: role || 'official',
        designation: designation || 'Statistical Officer',
        department: department || 'National Accounts Division (NAD)',
        jobRole: jobRole || 'Statistical Officer',
        competencyScores: [
          { skill: 'Survey Design', category: 'Statistical', level: 65 },
          { skill: 'Sampling Methods', category: 'Statistical', level: 70 },
          { skill: 'National Accounts', category: 'Statistical', level: 50 },
          { skill: 'Price Statistics', category: 'Statistical', level: 60 },
          { skill: 'Python', category: 'Technical', level: 40 },
          { skill: 'SQL', category: 'Technical', level: 65 }
        ]
      };

      localStore.officials.push(newOfficial);

      const token = jwt.sign({ id: newOfficial._id, role: newOfficial.role }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({
        message: 'Official registered successfully',
        token,
        user: { id: newOfficial._id, name: newOfficial.name, email: newOfficial.email, role: newOfficial.role, designation: newOfficial.designation, department: newOfficial.department, jobRole: newOfficial.jobRole }
      });
    }
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to register official' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    let user = null;

    if (mongoose.connection.readyState === 1) {
      user = await Official.findOne({ email });
    }
    
    if (!user) {
      await localStore.initDefaultData();
      user = localStore.officials.find(u => u.email === email);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const userId = user._id || user.id;
    const token = jwt.sign({ id: userId, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        designation: user.designation,
        department: user.department,
        jobRole: user.jobRole,
        competencyScores: user.competencyScores
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.getMe = async (req, res) => {
  try {
    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await Official.findById(req.user._id).select('-passwordHash');
    }
    if (!user && req.user) {
      user = req.user;
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};
