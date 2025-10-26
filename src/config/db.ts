import { MongoClient, Db, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI || "";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db: Db | null = null;

export async function connectDB(): Promise<void> {
  try {
    await client.connect();
    db = client.db("myapp");
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
}

export function getDB(): Db {
  if (!db) {
    throw new Error("❌ Database not initialized! Call connectDB() first.");
  }
  return db;
}
