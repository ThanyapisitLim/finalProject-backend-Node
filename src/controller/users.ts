import { getDB } from "../config/db";
import { ObjectId } from "mongodb"

export async function storeUser(username: string, password: string): Promise<string> {
  try {
    const db = getDB(); // ใช้ connection ที่เชื่อมแล้ว
    const usersCollection = db.collection("users");

    const newUser = { username, password };
    const result = await usersCollection.insertOne(newUser);

    console.log("✅ User stored with ID:", result.insertedId.toHexString());
    return result.insertedId.toHexString(); // แปลง ObjectId เป็น string
  } catch (error) {
    console.error("❌ Error storing user:", error);
    throw error;
  }
}

export async function getUserIdByUsername(username: string): Promise<any | null> {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ username });

    if (user) {
      console.log("✅ User found:", user);
      return user._id;
    } else {
      console.log("⚠️ User not found with username:", username);
      return null;
    }
  } catch (error) {
    console.error("❌ Error retrieving user by username:", error);
    throw error;
  }
}

export async function loginCheck(username: string, password: string): Promise<string> {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    // ตรวจสอบ username
    const user = await usersCollection.findOne({ username });
    if (!user) {
      console.log("⚠️ Username not found:", username);
      return "Username not found";
    }

    // ตรวจสอบ password
    if (user.password !== password) { // ถ้าใช้ hash ให้เปลี่ยนเป็น bcrypt.compare
      console.log("⚠️ Password incorrect for user:", username);
      return "Password incorrect";
    }

    console.log("✅ Login successful for user:", username);
    return "Login successful";

  } catch (error) {
    console.error("❌ Error checking login:", error);
    throw error;
  }
}

export async function getUserById(userId: string): Promise<any | null> {
  try {
    if (!ObjectId.isValid(userId)) {
      throw new Error(`Invalid ObjectId: ${userId}`);
    }

    const db = getDB();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (user) console.log("✅ User retrieved:", user);
    else console.log("⚠️ User not found with ID:", userId);

    return user;
  } catch (error) {
    console.error("❌ Error retrieving user:", error);
    throw error;
  }
}