const User = require('../models/User');
const Progress = require('../models/Progress');
const bcrypt = require('bcryptjs');
const { createToken } = require('../auth/auth');

const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) return null;
      return await User.findById(user.id);
    },
    getProgress: async (_, { userId }) => await Progress.find({ userId }),
    leaderboard: async (_, { level }) => {
      const filter = level ? { level } : {};
    
      const results = await Progress.find(filter)
        .sort({ score: -1, timeTaken: 1 }) // Sort by highest score, then fastest time
        .limit(10)
        .populate('userId', 'username');

    
      return results.map(entry => ({
        id: entry._id,
        username: entry.userId.username,
        level: entry.level,
        score: entry.score,
        timeTaken: entry.timeTaken,
        wonAgainstAI: entry.wonAgainstAI,
      }));
    },
  },
  Mutation: {
    register: async (_, { username, password }) => {
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ username, password: hash });
      return createToken(user);
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid login");
      }
      return createToken(user);
    },
    saveProgress: async (_, args, { user }) => {
      if (!user) throw new Error("Unauthorized");
    
      const { level, score, timeTaken, wonAgainstAI } = args;
    
      const existing = await Progress.findOne({ userId: user.id, level });
    
      if (!existing || score > existing.score) {
        await Progress.findOneAndUpdate(
          { userId: user.id, level },
          { score, timeTaken, wonAgainstAI },
          { upsert: true, new: true }
        );
      }
    
      return true;
    },
    
  },
};

module.exports = resolvers;
