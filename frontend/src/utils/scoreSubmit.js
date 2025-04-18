import { gql } from "@apollo/client";
import { client } from "../apollo/client";


export const submitScore = async (score, level, timeTaken) => {
  const SAVE_PROGRESS = gql`
    mutation SaveProgress($score: Int!, $level: Int!, $timeTaken: Int!, $wonAgainstAI: Boolean!) {
      saveProgress(score: $score, level: $level, timeTaken: $timeTaken, wonAgainstAI: $wonAgainstAI)
    }
  `;

  try {
    await client.mutate({
      mutation: SAVE_PROGRESS,
      variables: {
        score,
        level,
        timeTaken,         
        wonAgainstAI: false,  // handle later
      },
    });

    console.log("Score submitted:", score);
  } catch (err) {
    console.error("Failed to submit score:", err);
  }
};
