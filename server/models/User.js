const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  winterArcStart: { type: Date, default: Date.now },
  winterArcLength: { type: Number, default: 90 },
  winterArcEnd: { type: Date },
  loginDates: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
