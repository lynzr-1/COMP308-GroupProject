import { gql } from "@apollo/client";
import { client } from "../apollo/client";

export const submitAchievement = async (achievements) => {
  const UNLOCK_ACHIEVEMENTS = gql`
    mutation unlockAchievements($achievements: [String!]!) {
      unlockAchievements(achievements: $achievements)
    }
  `;

  try {
    await client.mutate({
      mutation: UNLOCK_ACHIEVEMENTS,
      variables: { achievements },
    });
    console.log("Achievements submitted:", achievements);
  } catch (err) {
    console.error("Failed to submit achievements:", err);
  }
};
