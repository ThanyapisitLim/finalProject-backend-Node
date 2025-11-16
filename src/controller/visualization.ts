import { Request, Response, NextFunction } from 'express';
import { groupVotesByPoll, getAllVote } from './vote';

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
        
        // 2. Map สำหรับชื่อ Poll (สำคัญสำหรับการนำเสนอ)
        const pollTitles: { [key: string]: string } = {}
        
        // 3. Render หน้า EJS
        res.render('blockchain_view', { // 👈 เปลี่ยนชื่อ View เป็น blockchain_view
            title: "Blockchain Vote Chain Structure",
            groupedResults: groupedResults,
            pollTitles: pollTitles, // ส่ง Poll Titles ไปด้วย
        });

    } catch (error) {
        next(error);
    }
};