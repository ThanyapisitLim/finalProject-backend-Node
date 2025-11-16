import express, { Request, Response, NextFunction } from 'express';
import { getVoteByUserId } from '../../controller/vote';
import { getQuestionByPollId } from '../../controller/poll';
const router = express.Router();

/* GET users listing. */
router.get('/:userId', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId;
        // ... (การตรวจสอบ userId และ getPoll เดิม) ...
        
        const getPoll = await getVoteByUserId(userId);
        if (!getPoll || getPoll.length === 0) {
            return res.status(200).json({ message: 'No votes found for the given user ID', votes: [] });
        }

        // 1. ดึง Poll IDs ทั้งหมดที่โหวตไป (ใช้ Set เพื่อให้ได้ ID ที่ไม่ซ้ำ)
        const pollIds = [...new Set(getPoll.map(vote => vote.pollId))];
        
        // 2. ดึง Question ของทุก Poll พร้อมกัน
        const questionPromises = pollIds.map(pollId => getQuestionByPollId(pollId));
        const questions = await Promise.all(questionPromises);

        // 3. สร้าง Map สำหรับเข้าถึง Question ด้วย Poll ID
        const pollQuestionMap = new Map<string, string | null>();
        pollIds.forEach((pollId, index) => {
            pollQuestionMap.set(pollId, questions[index]);
        });

        // 4. ผนวก Question เข้ากับข้อมูลโหวตแต่ละรายการ
        const votesWithQuestions = getPoll.map(vote => ({
            ...vote,
            question: pollQuestionMap.get(vote.pollId) || 'Question not found'
        }));

        console.log(`Successfully fetched ${votesWithQuestions.length} votes with questions.`);
        
        // 5. ส่งผลลัพธ์ที่สมบูรณ์กลับไป
        res.status(200).json({ votes: votesWithQuestions });

    } catch (error) {
        next(error);
    }
});

export default router;