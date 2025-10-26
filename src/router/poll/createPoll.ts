import express, { Request, Response, NextFunction } from 'express';
import { insertPoll } from '../../controller/poll';
import { getUserById } from '../../controller/users';

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, question, options, expireAt } = req.body;
        //Check required fields
        if (
            !userId ||
            !question ||
            !options ||
            !Array.isArray(options) ||
            !expireAt
        ) {
            return res.status(400).json({ message: "Invalid request: Missing required fields." });
        }
        
        //Check user existence
        let user;
        try {
            user = await getUserById(userId); 
        } catch (e: any) {
            if (e.message && e.message.includes("Invalid ObjectId")) {
                console.error(`❌ Bad Request: ${e.message}`);
                return res.status(400).json({ message: "Invalid user ID format. Must be a valid 24-character hexadecimal string." });
            }
            throw e;
        }

        //Check if user found
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        
        //Check expireAt validity
        const expireDate = new Date(expireAt);
        if (isNaN(expireDate.getTime())) {
            return res.status(400).json({ message: "Invalid expireAt date" });
        }

        //Create poll
        const poll = await insertPoll(userId, question, options, expireDate);
        res.status(201).json(poll);
    } catch (error) {
        next(error);
    }
});

export default router;
