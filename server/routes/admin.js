const express = require('express');
const User = require('../models/User');
const OU = require('../models/OU');
const Division = require('../models/Division');
const auth = require('../middleware/auth');
const router = express.Router();

// Assign user to divisions and OUs (admin only)
router.post('/assign', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Only admins can assign users' });
    const { userId, divisionIds, ouIds } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.divisions = divisionIds;
    user.ous = ouIds;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Change user role (admin only)
router.post('/role', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Only admins can change roles' });
    const { userId, role } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = role;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List all users, OUs, and divisions (for admin UI)
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Only admins can view all users' });
    const users = await User.find().populate('divisions ous');
    const ous = await OU.find().populate('divisions');
    const divisions = await Division.find();
    res.json({ users, ous, divisions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
