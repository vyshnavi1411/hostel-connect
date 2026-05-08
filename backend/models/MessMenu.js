const mongoose = require('mongoose');

const dayMenuSchema = new mongoose.Schema({
  breakfast: { type: String, default: '' },
  lunch: { type: String, default: '' },
  snacks: { type: String, default: '' },
  dinner: { type: String, default: '' },
  specialMeals: [{ type: String, enum: ['breakfast', 'lunch', 'snacks', 'dinner'] }]
}, { _id: false });

const messMenuSchema = new mongoose.Schema({
  weekStartDate: { type: String, default: null }, // Format: YYYY-MM-DD (Monday of that week). null = legacy
  monday: { type: dayMenuSchema, default: () => ({}) },
  tuesday: { type: dayMenuSchema, default: () => ({}) },
  wednesday: { type: dayMenuSchema, default: () => ({}) },
  thursday: { type: dayMenuSchema, default: () => ({}) },
  friday: { type: dayMenuSchema, default: () => ({}) },
  saturday: { type: dayMenuSchema, default: () => ({}) },
  sunday: { type: dayMenuSchema, default: () => ({}) },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('MessMenu', messMenuSchema);
