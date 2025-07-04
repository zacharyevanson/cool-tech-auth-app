const express = require('express');
const CredentialRepository = require('../models/CredentialRepository');
const Division = require('../models/Division');
const auth = require('../middleware/auth');
const router = express.Router();

// Get credentials for a division (requires JWT and membership)
router.get('/:divisionId', auth, async (req, res) => {
  try {
    const repo = await CredentialRepository.findOne({ division: req.params.divisionId });
    if (!repo) return res.status(404).json({ message: 'Repository not found' });
    // Check user membership
    if (!req.user.divisions || !req.user.divisions.includes(req.params.divisionId)) {
      return res.status(403).json({ message: 'Access denied: not a member of this division' });
    }
    res.json(repo.credentials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a credential to a division's repo (normal users and up)
router.post('/:divisionId', auth, async (req, res) => {
  try {
    const { name, value } = req.body;
    const repo = await CredentialRepository.findOne({ division: req.params.divisionId });
    if (!repo) return res.status(404).json({ message: 'Repository not found' });
    if (!req.user.divisions || !req.user.divisions.includes(req.params.divisionId)) {
      return res.status(403).json({ message: 'Access denied: not a member of this division' });
    }
    repo.credentials.push({ name, value });
    await repo.save();
    res.json(repo.credentials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a specific credential (manager or admin only)
router.put('/:divisionId/:credentialId', auth, async (req, res) => {
  try {
    const { name, value } = req.body;
    const repo = await CredentialRepository.findOne({ division: req.params.divisionId });
    if (!repo) return res.status(404).json({ message: 'Repository not found' });
    if (!req.user.divisions || !req.user.divisions.includes(req.params.divisionId)) {
      return res.status(403).json({ message: 'Access denied: not a member of this division' });
    }
    if (!['manager', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only managers or admins can update credentials' });
    }
    const cred = repo.credentials.id(req.params.credentialId);
    if (!cred) return res.status(404).json({ message: 'Credential not found' });
    cred.name = name || cred.name;
    cred.value = value || cred.value;
    cred.updatedAt = Date.now();
    await repo.save();
    res.json(cred);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a specific credential (manager or admin only)
router.delete('/:divisionId/:credentialId', auth, async (req, res) => {
  try {
    const repo = await CredentialRepository.findOne({ division: req.params.divisionId });
    if (!repo) return res.status(404).json({ message: 'Repository not found' });
    if (!req.user.divisions || !req.user.divisions.includes(req.params.divisionId)) {
      return res.status(403).json({ message: 'Access denied: not a member of this division' });
    }
    if (!['manager', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only managers or admins can delete credentials' });
    }
    const cred = repo.credentials.id(req.params.credentialId);
    if (!cred) return res.status(404).json({ message: 'Credential not found' });
    cred.deleteOne();
    await repo.save();
    res.json({ message: 'Credential deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
