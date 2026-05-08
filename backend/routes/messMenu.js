const express = require('express');
const router = express.Router();
const MessMenu = require('../models/MessMenu');
const MealFeedback = require('../models/MealFeedback');
const { protect, admin } = require('../middleware/authMiddleware');

// Helper: get Monday date string (YYYY-MM-DD) for a given date offset
// offset = 0 → current week, offset = -7 → last week, etc.
function getMondayStr(offsetDays = 0) {
  const now = new Date();
  now.setDate(now.getDate() + offsetDays);
  const day = now.getDay(); // 0=Sun, 1=Mon...
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust to Monday
  const monday = new Date(now.setDate(diff));
  const tz = monday.getTimezoneOffset();
  return new Date(monday.getTime() - tz * 60000).toISOString().split('T')[0];
}

// @desc    Get the mess menu (global)
// @route   GET /api/mess-menu
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let menu = await MessMenu.findOne({ weekStartDate: null });
    if (!menu) {
      menu = await MessMenu.create({ weekStartDate: null });
    }
    res.json(menu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update the mess menu (global)
// @route   PUT /api/mess-menu
// @access  Private/Admin
router.put('/', protect, admin, async (req, res) => {
  try {
    let menu = await MessMenu.findOne({ weekStartDate: null });
    if (!menu) {
      menu = new MessMenu({ weekStartDate: null });
    }

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    days.forEach(day => {
      if (req.body[day]) {
        menu[day] = req.body[day];
      }
    });

    menu.updatedBy = req.user._id;
    menu.updatedAt = Date.now();

    const updatedMenu = await menu.save();
    res.json(updatedMenu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Submit or update meal feedback
// @route   POST /api/mess-menu/feedback
// @access  Private
router.post('/feedback', protect, async (req, res) => {
  const { date, mealType, rating, comment } = req.body;

  try {
    if (!date || !mealType || !rating) {
      return res.status(400).json({ message: 'Please provide date, mealType, and rating' });
    }

    let feedback = await MealFeedback.findOne({ user: req.user._id, date, mealType });

    if (feedback) {
      feedback.rating = rating;
      if (comment !== undefined) feedback.comment = comment;
      await feedback.save();
    } else {
      feedback = await MealFeedback.create({
        user: req.user._id,
        date,
        mealType,
        rating,
        comment
      });
    }

    res.status(201).json(feedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get feedback stats and user's feedback for a specific date
// @route   GET /api/mess-menu/feedback/:date
// @access  Private
router.get('/feedback/:date', protect, async (req, res) => {
  try {
    const { date } = req.params;

    const allFeedback = await MealFeedback.find({ date });

    const stats = {
      breakfast: { totalRating: 0, count: 0, average: 0 },
      lunch: { totalRating: 0, count: 0, average: 0 },
      snacks: { totalRating: 0, count: 0, average: 0 },
      dinner: { totalRating: 0, count: 0, average: 0 }
    };

    allFeedback.forEach(f => {
      if (stats[f.mealType]) {
        stats[f.mealType].totalRating += f.rating;
        stats[f.mealType].count += 1;
      }
    });

    Object.keys(stats).forEach(meal => {
      if (stats[meal].count > 0) {
        stats[meal].average = (stats[meal].totalRating / stats[meal].count).toFixed(1);
      }
    });

    const userFeedback = allFeedback.filter(f => f.user.toString() === req.user._id.toString());
    const userRatings = {};
    userFeedback.forEach(f => {
      userRatings[f.mealType] = { rating: f.rating, comment: f.comment };
    });

    res.json({ stats, userRatings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
