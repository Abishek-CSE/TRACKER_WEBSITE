const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Journal = require('../models/Journal');

// @route   GET api/journal
// @desc    Get all user journals/notes
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const entries = await Journal.find({ userId: req.user.id }).sort({ date: 1 });
    res.json(entries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/journal
// @desc    Create or Update a journal entry for a specific date
// @access  Private
router.post('/', auth, async (req, res) => {
  const { date, mood, content } = req.body;
  try {
    let entry = await Journal.findOne({ userId: req.user.id, date });
    
    if (entry) {
      // Update
      entry.mood = mood;
      entry.content = content;
      await entry.save();
      return res.json(entry);
    }
    
    // Create
    entry = new Journal({
      userId: req.user.id,
      date,
      mood,
      content
    });
    
    await entry.save();
    res.json(entry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
