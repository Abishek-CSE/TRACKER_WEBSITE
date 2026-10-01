const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Habit = require('../models/Habit');

// @route   GET api/habits
// @desc    Get all user habits
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/habits
// @desc    Create a new habit
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, icon, color, frequency } = req.body;
  try {
    const newHabit = new Habit({
      userId: req.user.id,
      name,
      icon,
      color,
      frequency
    });
    const habit = await newHabit.save();
    res.json(habit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
