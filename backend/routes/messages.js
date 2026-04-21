const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// @route   GET /api/messages
// @desc    Get recent messages
// @access  Public (should ideally be auth'd, but matching existing system)
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('user', 'name role') // Populate the user field with name and role
      .sort({ createdAt: -1 })
      .limit(50);
    
    // Reverse because we sort descending to get the *latest* 50, but we want them displayed chronologically
    res.json(messages.reverse());
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
