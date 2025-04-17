const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  level: Number,
  score: Number,
  timeTaken: Number,
  wonAgainstAI: Boolean,
});

module.exports = mongoose.model('Progress', progressSchema);
