const mongoose = require('mongoose');

const DailyProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  habitsCompleted: { type: Number, default: 0 },
  totalHabits: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
});

module.exports = mongoose.model('DailyProgress', DailyProgressSchema);
