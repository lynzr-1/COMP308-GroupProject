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
    leaderboard: async () => await Progress.find().sort({ score: -1 }).limit(10),
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
      await Progress.create({ userId: user.id, ...args });
      return true;
    },
  },
};

module.exports = resolvers;
