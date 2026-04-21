const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Plumbing', 'Electrical', 'Cleaning', 'Wi-Fi', 'Other']
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  hostelBlock: {
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
