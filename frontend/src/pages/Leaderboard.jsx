import React from "react";
import { useQuery, gql } from "@apollo/client";

const GET_LEADERBOARD = gql`
  query GetLeaderboard($level: Int) {
    leaderboard(level: $level) {
      username
      score
      level
      timeTaken
    }
  }
`;

const Leaderboard = ({ level = 1 }) => {
  const { loading, error, data } = useQuery(GET_LEADERBOARD, {
    variables: { level },
  });

  if (loading) return <p>Loading leaderboard...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>🏆 Leaderboard – Level {level}</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {data.leaderboard.map((entry, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{entry.username}</td>
              <td>{entry.score}</td>
              <td>{entry.timeTaken || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
