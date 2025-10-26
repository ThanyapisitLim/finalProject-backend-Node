import express, { Request, Response, NextFunction } from 'express';
import { insertPoll } from '../../controller/poll';

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, question, options, expireAt } = req.body;

        // ตรวจสอบ request
        if (
            !userId ||
            !question ||
            !options ||
            !Array.isArray(options) ||
            !expireAt
        ) {
            return res.status(400).json({ message: "Invalid request" });
        }

        // แปลง expireAt เป็น Date object
        const expireDate = new Date(expireAt);
        if (isNaN(expireDate.getTime())) {
            return res.status(400).json({ message: "Invalid expireAt date" });
        }

        // เรียก controller
        const poll = await insertPoll(userId, question, options, expireDate);
        res.status(201).json(poll);
    } catch (error) {
        next(error);
    }
});

export default router;
