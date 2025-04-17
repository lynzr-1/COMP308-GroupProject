const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    xp: Int
    levelsUnlocked: Int
    achievements: [String]
  }

  type Progress {
    id: ID!
    userId: String!
    level: Int!
    score: Int!
    timeTaken: Int!
    wonAgainstAI: Boolean!
  }

  type LeaderboardEntry {
    id: ID!
    username: String!
    level: Int!
    score: Int!
    timeTaken: Int!
    wonAgainstAI: Boolean!
  }


  type Query {
    me: User
    getProgress(userId: String!): [Progress]
    leaderboard(level: Int): [LeaderboardEntry]
  }

  type Mutation {
    register(username: String!, password: String!): String
    login(username: String!, password: String!): String
    saveProgress(level: Int!, score: Int!, timeTaken: Int!, wonAgainstAI: Boolean!): Boolean
    unlockAchievements(achievements: [String!]!): Boolean
  }
`;

module.exports = typeDefs;
