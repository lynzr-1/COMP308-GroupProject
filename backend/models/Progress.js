const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: String,
  level: Number,
  score: Number,
  timeTaken: Number,
  wonAgainstAI: Boolean,
});

module.exports = mongoose.model('Progress', progressSchema);
