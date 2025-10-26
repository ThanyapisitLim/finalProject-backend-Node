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

  const newPoll = {
    creator: userId,
    question,
    options,
    createdAt: new Date(),
    expireAt,
    pollId: new ObjectId().toHexString(),
  };

  const result = await pollCollection.insertOne(newPoll);
  console.log("✅ Poll inserted with ID:", result.insertedId);
  console.log("📊 Poll details:", newPoll);
  return { ...newPoll, _id: result.insertedId };
}
