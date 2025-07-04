const express = require('express');
const Division = require('../models/Division');
const auth = require('../middleware/auth');
const router = express.Router();

// Get division info by ID (for normal users to see their division names)
router.get('/:id', auth, async (req, res) => {
  try {
    const division = await Division.findById(req.params.id);
    if (!division) return res.status(404).json({ message: 'Division not found' });
    res.json({ _id: division._id, name: division.name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
