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

  if (loading) return <div className="alert alert-info">Loading leaderboard...</div>;
  if (error) return <div className="alert alert-danger">Error: {error.message}</div>;

  return (
    <div className="mt-4">
      <h2 className="mb-3">Leaderboard – Level {level}</h2>
      <p className="text-muted">(Sorted by highest score, then fastest time)</p>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
            <th>Time (s)</th>
          </tr>
        </thead>
        <tbody>
          {data.leaderboard.map((entry, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{entry.username}</td>
              <td>{entry.score}</td>
              <td>{entry.timeTaken ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
