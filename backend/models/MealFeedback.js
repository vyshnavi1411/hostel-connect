const mongoose = require('mongoose');

const mealFeedbackSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  date: { 
    type: String, 
    required: true // Format: YYYY-MM-DD
  },
  mealType: { 
    type: String, 
    enum: ['breakfast', 'lunch', 'snacks', 'dinner'], 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  comment: { 
    type: String, 
    default: '' 
  }
}, { timestamps: true });

// Ensure a user can only submit one rating per meal per day
mealFeedbackSchema.index({ user: 1, date: 1, mealType: 1 }, { unique: true });

module.exports = mongoose.model('MealFeedback', mealFeedbackSchema);
