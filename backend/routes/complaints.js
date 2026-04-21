const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET api/complaints
// @desc    Get all complaints (Admin) or user complaints (Student)
router.get('/', protect, async (req, res) => {
  try {
    let complaints;
    if (req.user.role === 'admin') {
      complaints = await Complaint.find().populate('user', 'name email').sort({ createdAt: -1 });
    } else {
      complaints = await Complaint.find({ user: req.user.id }).sort({ createdAt: -1 });
    }
    res.json(complaints);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/complaints
// @desc    Create a complaint
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, category, hostelBlock, roomNumber } = req.body;

    const newComplaint = new Complaint({
      user: req.user.id,
      title,
      description,
      category,
      hostelBlock,
      roomNumber
    });

    const complaint = await newComplaint.save();
    res.json(complaint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/complaints/:id
// @desc    Update complaint status (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    await complaint.save();

    res.json(complaint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
