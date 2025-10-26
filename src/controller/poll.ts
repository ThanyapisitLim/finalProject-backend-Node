import { getDB } from "../config/db";
import { ObjectId } from "mongodb";

export async function insertPoll(
  userId: string,
  question: string,
  options: string[],
  expireAt: Date
) {
  const db = getDB();
  const pollCollection = db.collection("polls");

  //Create new poll object
  const newPoll = {
    creator: userId,
    question,
    options,
    createdAt: new Date(),
    expireAt,
  };

  const result = await pollCollection.insertOne(newPoll);
  console.log("✅ Poll inserted with ID:", result.insertedId);
  console.log("📊 Poll details:", newPoll);
  return { ...newPoll, _id: result.insertedId };
}

export async function getPollByPollId(pollId: string): Promise<any | null> {
  try {
    if (!ObjectId.isValid(pollId)) {
      throw new Error(`Invalid ObjectId: ${pollId}`);
    }

    const db = getDB();
    const pollsCollection = db.collection("polls");

    const poll = await pollsCollection.findOne({ _id: new ObjectId(pollId) });

    return poll;
  } catch (error) {
    console.error("❌ Error retrieving poll:", error);
    throw error;
  }
}