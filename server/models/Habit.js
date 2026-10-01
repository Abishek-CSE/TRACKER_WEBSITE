const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  icon: { type: String, default: 'List' },
  color: { type: String, default: '#60A5FA' },
  frequency: { type: String, default: 'daily' },
  completedDates: [{ type: String }],
  streak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Habit', HabitSchema);
