const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { protect, admin } = require('../middleware/authMiddleware');

// The router now accepts `io` so it can emit real-time notifications
module.exports = (io) => {

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

      // Smart heuristic for priority calculation
      let priority = 'Low';
      const textToAnalyze = (title + ' ' + description).toLowerCase();

      const highPriorityKeywords = ['fire', 'leak', 'urgent', 'emergency', 'flood', 'spark', 'shock', 'danger', 'broken pipe', 'short circuit'];
      const mediumPriorityKeywords = ['wifi', 'wi-fi', 'internet', 'cleaning', 'dirty', 'smell', 'noise', 'fan', 'light', 'water', 'blocked'];

      if (highPriorityKeywords.some(keyword => textToAnalyze.includes(keyword))) {
        priority = 'High';
      } else if (mediumPriorityKeywords.some(keyword => textToAnalyze.includes(keyword))) {
        priority = 'Medium';
      }

      const newComplaint = new Complaint({
        user: req.user.id,
        title,
        description,
        category,
        hostelBlock,
        roomNumber,
        priority
      });

      const complaint = await newComplaint.save();
      res.json(complaint);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  // @route   PUT api/complaints/:id
  // @desc    Update complaint status (Admin only) + emit real-time notification
  router.put('/:id', protect, admin, async (req, res) => {
    try {
      const { status, adminRemarks } = req.body;

      const complaint = await Complaint.findById(req.params.id);

      if (!complaint) {
        return res.status(404).json({ message: 'Complaint not found' });
      }

      if (status) {
        if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
          return res.status(400).json({ message: 'Invalid status' });
        }
        complaint.status = status;
      }

      if (adminRemarks !== undefined) {
        complaint.adminRemarks = adminRemarks;
      }

      await complaint.save();

      // Emit real-time notification to the complaint owner
      if (io) {
        io.emit('complaintStatusChanged', {
          userId: complaint.user.toString(),
          complaintId: complaint._id.toString(),
          title: complaint.title,
          status: complaint.status,
          adminRemarks: complaint.adminRemarks
        });
      }

      res.json(complaint);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  // @route   POST api/complaints/:id/upvote
  // @desc    Upvote/remove upvote for a complaint
  router.post('/:id/upvote', protect, async (req, res) => {
    try {
      const complaint = await Complaint.findById(req.params.id);

      if (!complaint) {
        return res.status(404).json({ message: 'Complaint not found' });
      }

      if (complaint.upvotes.includes(req.user.id)) {
        complaint.upvotes = complaint.upvotes.filter(id => id.toString() !== req.user.id);
      } else {
        complaint.upvotes.unshift(req.user.id);
      }

      await complaint.save();
      res.json(complaint.upvotes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  return router;
};
