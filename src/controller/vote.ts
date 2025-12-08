import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { WithId, Document } from 'mongodb';
import { getDB } from '../config/db';
import { getPollByPollId } from './poll';

const jwtSecret = process.env.JWT_SECRET || 'defaultsecretkey';
const JWT_EXPIRES_IN = '1h';

interface RawVoteData {
    _id: string;
    userId: string;
    pollId: string;
    selectedOption: string;
    timestamp: string;
    previousHash: string | null;
    currentHash: string;
}


// Helper function: แยกเอาเฉพาะส่วนลายเซ็น (Signature) ของ JWT
function extractJWTSignature(token: string): string {
    const parts = token.split('.');
    return parts.length === 3 ? parts[2] : token;
}

//JWT ENCODER & DECODER
export function encodeDataToJWT(payload: any): string {
    try {
        const token = jwt.sign(payload, jwtSecret, { expiresIn: JWT_EXPIRES_IN });
        return token;
    } catch (error) {
        console.error("❌ Error encoding data to JWT:", error);
        throw new Error("Failed to encode data.");
    }
}

export function decodeJWT(token: string): any {
    try {
        const decoded = jwt.verify(token, jwtSecret);
        return decoded;
    } catch (error) {
        // หาก token ไม่ถูกต้องหรือไม่ใช่ JWT ของเรา จะเกิด Error
        console.error("❌ Error decoding JWT:", error);
        throw new Error("Invalid or expired token.");
    }
}

export async function vote(
    userId: string,
    pollId: string,
    selectedOption: string,
): Promise<Array<{
    userId: string;
    pollId: string;
    selectedOption: string;
    timestamp: Date;
    currentHash: string;
    previousHash: string | null;
}>> {
    try {
        const db = getDB();
        const voteCollection = db.collection<{
            userId: string;
            pollId: string;
            selectedOption: string;
            timestamp: Date;
            currentHash: string;
            previousHash: string | null;
        }>("votes");

        //Find last vote for the poll to get previousHash
        const lastVote = await voteCollection.findOne<{ currentHash: string } & WithId<Document>>(
            { pollId: pollId },
            {
                sort: { timestamp: -1 }, // เรียงจากเวลาล่าสุด
                projection: { currentHash: 1 } // เอามาแค่ฟิลด์ currentHash (เป็น JWT เต็มๆ)
            }
        );

        //Prepare previousHash
        const previousHashToken = lastVote ? lastVote.currentHash : null;
        const previousHash = previousHashToken ? extractJWTSignature(previousHashToken) : null;

        //Prepare current vote data
        const currentVoteData = {
            userId,
            pollId,
            selectedOption,
            timestamp: new Date(),
            previousHash,
        };

        //Create currentHash
        const currentHash = encodeDataToJWT(currentVoteData);

        const currentVote = {
            ...currentVoteData, // ข้อมูลทั้งหมดที่ใช้เข้ารหัส
            currentHash,
        };

        //Insert vote into DB
        const result = await voteCollection.insertOne(currentVote as any); // Type assertion for safety with DB insert
        console.log("✅ Vote inserted with ID:", result.insertedId);
        console.log("🗳️ Vote details (Chain Link: " + (previousHash ? "🔗" : "🆕") + ") :", currentVote);

        return [currentVote];
    } catch (error) {
        console.error("❌ Error during vote and chaining:", error);
        throw error;
    }
}

export async function checkVoteSelected(vote: any, pollId: string): Promise<boolean> {
    try {
        const db = getDB();
        const pollsCollection = db.collection("polls");

        const validOptions = await getPollByPollId(pollId);
        if (validOptions.options && validOptions.options.includes(vote.selectedOption)) {
            return true;
        }
        return false;
    } catch (error) {
        console.error("❌ Error checking vote selected option:", error);
        throw error;
    }
}

export async function getVotesByPollId(pollId: string): Promise<any[]> {
    try {
        const db = getDB();
        const voteCollection = db.collection("votes");

        const votes = await voteCollection.find({ pollId: pollId }).toArray();
        return votes;
    } catch (error) {
        console.error("❌ Error retrieving votes by pollId:", error);
        throw error;
    }
}

export async function getVoteByUserId(userId: string): Promise<any[]> {
    try {
        const db = getDB();
        const voteCollection = db.collection("votes");

        const votes = await voteCollection.find({ userId: userId }).toArray();
        return votes;
    } catch (error) {
        console.error("❌ Error retrieving votes by userId:", error);
        throw error;
    }
}

export function groupVotesByPoll(rawData: RawVoteData[]): { [pollId: string]: RawVoteData[] } {
    const groupedData: { [pollId: string]: RawVoteData[] } = {};

    rawData.forEach(vote => {
        const { pollId } = vote;

        if (!groupedData[pollId]) {
            groupedData[pollId] = [];
        }

        groupedData[pollId].push(vote);
    });

    // Optional: จัดเรียงโหวตตาม Timestamp ภายในแต่ละ Poll เพื่อให้เห็น Chain ชัดเจน
    for (const pollId in groupedData) {
        groupedData[pollId].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }

    return groupedData;
}

export function getAllVote(): Promise<any[]> {
    try {
        const db = getDB();
        const votesCollection = db.collection("votes");

        return votesCollection.find({}).toArray();
    } catch (error) {
        console.error("❌ Error retrieving all polls:", error);
        throw error;
    }
}

export function deleteVoteByPollId(pollId: string): Promise<void> {
    try {
        const db = getDB();
        const votesCollection = db.collection("votes");

        return votesCollection.deleteMany({ pollId: pollId }).then(() => { });
    } catch (error) {
        console.error("❌ Error deleting votes by pollId:", error);
        throw error;
    }
}