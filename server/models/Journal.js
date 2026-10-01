const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  mood: { type: String },
  wins: [{ type: String }],
  challenges: [{ type: String }],
  tomorrowFocus: [{ type: String }],
  content: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Journal', JournalSchema);
