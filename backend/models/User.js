const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  xp: { type: Number, default: 0 },
  levelsUnlocked: { type: Number, default: 1 },
  achievements: [String],
});

module.exports = mongoose.model('User', userSchema);
