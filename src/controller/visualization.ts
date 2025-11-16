import { Request, Response, NextFunction } from 'express';
import { groupVotesByPoll, getAllVote } from './vote';
import { getQuestionByPollId } from './poll';

interface RawVoteData {
    _id: string;
    userId: string;
    pollId: string;
    selectedOption: string;
    timestamp: string;
    previousHash: string | null; // นี่คือ Hash Pointer
    currentHash: string; // นี่คือ Hash ของบล็อกปัจจุบัน
}


export const visualizeAllVotes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const rawVotes = await getAllVote(); 

        // 1. จัดกลุ่มโหวตตาม Poll ID
        const groupedResults = groupVotesByPoll(rawVotes as RawVoteData[]);
        
        // 2. ดึง Poll IDs ทั้งหมดที่ต้องการดึงชื่อ
        const pollIds = Object.keys(groupedResults);
        
        // 3. ใช้ Promise.all เพื่อดึงชื่อ (Question) ของทุก Poll พร้อมกัน
        const pollQuestionPromises = pollIds.map(pollId => 
            getQuestionByPollId(pollId) // 👈 ต้องส่ง pollId เข้าไปในฟังก์ชัน
        );

        // 4. รอผลลัพธ์ทั้งหมด
        const pollQuestions = await Promise.all(pollQuestionPromises);

        // 5. สร้าง Map สำหรับชื่อ Polls: { 'pollId': 'Question Title', ... }
        const pollTitles: { [key: string]: string } = {};
        pollIds.forEach((pollId, index) => {
            // ใช้ Question ที่ดึงมา หรือใช้ Poll ID เป็นชื่อสำรองหากไม่พบ Question
            const question = pollQuestions[index];
            pollTitles[pollId] = question || `Unknown Poll (${pollId})`;
        });
        
        // 6. Render หน้า EJS
        res.render('blockchain_view', {
            title: "Blockchain Vote Chain Structure",
            groupedResults: groupedResults,
            pollTitles: pollTitles, // ส่ง Map ชื่อ Poll ID ไปยัง EJS
        });

    } catch (error) {
        next(error);
    }
};