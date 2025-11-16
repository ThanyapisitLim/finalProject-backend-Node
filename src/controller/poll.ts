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

export async function getAllActivePoll(): Promise<any[]> {
  try {
    const db = getDB();
    const pollsCollection = db.collection("polls");
    // ดึงเฉพาะที่ expireAt > เวลาปัจจุบัน
    const now = new Date();
    const allPolls = await pollsCollection
      .find({ expireAt: { $gt: now } })
      .sort({ createdAt: -1 }) // 👈 ใหม่ก่อน (descending)
      .toArray();
    return allPolls;
  } catch (error) {
    console.error("❌ Error retrieving all active polls:", error);
    throw error;
  }
}

export function getPollByUserId(userId: string): Promise<any[]> {
  try {
    const db = getDB();
    const pollsCollection = db.collection("polls");

    return pollsCollection.find({ creator: userId }).toArray();
  } catch (error) {
    console.error("❌ Error retrieving polls by user ID:", error);
    throw error;
  }
}

export async function getQuestionByPollId(pollId: string): Promise<string | null> {
  try {
    if (!ObjectId.isValid(pollId)) {
      throw new Error(`Invalid ObjectId: ${pollId}`);
    }

    const db = getDB();
    const pollsCollection = db.collection<{ question: string }>("polls"); // เพิ่ม Type เพื่อความชัดเจน

    const poll = await pollsCollection.findOne(
      { _id: new ObjectId(pollId) },
      { projection: { question: 1 } }
    );
    return poll ? poll.question : null;

  } catch (error) {
    console.error("❌ Error retrieving question by poll ID:", error);
    throw error;
  }
}

export async function deletePoll(pollId: string): Promise<string[] | null> {
  try {
    if (!ObjectId.isValid(pollId)) {
      throw new Error(`Invalid ObjectId: ${pollId}`);
    }

    const db = getDB();
    const pollsCollection = db.collection("polls");

    const result = await pollsCollection.deleteOne({ _id: new ObjectId(pollId) });

    if (result.deletedCount === 1) {
      console.log("✅ Poll deleted with ID:", pollId);
      return [pollId];
    } else {
      console.log("⚠️ No poll found to delete with ID:", pollId);
      return null;
    }
  } catch (error) {
    console.error("❌ Error deleting poll:", error);
    throw error;
  } 
}