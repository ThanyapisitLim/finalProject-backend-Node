import express, { Request, Response, NextFunction } from 'express';
import { vote } from '../../controller/vote';
import { isValidObjectId } from 'mongoose';
import { getUserById } from '../../controller/users';
import { getPollByPollId } from '../../controller/poll';

const router = express.Router();

router.post('/', async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { userId, pollId, selectedOption } = req.body;

        //Check required fields
        if (!userId || !pollId || !selectedOption) {
            return res.status(400).json({
                message: "Invalid request: Missing userId, pollId, or selectedOption."
            });
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


                //Check user existence
        let poll;
        try {
            poll = await getPollByPollId(pollId);
            console.log("Poll fetched for voting:", poll);
        } catch (e: any) {
            if (e.message && e.message.includes("Invalid ObjectId")) {
                console.error(`❌ Bad Request: ${e.message}`);
                return res.status(400).json({ message: "Invalid poll ID format. Must be a valid 24-character hexadecimal string." });
            }
            throw e;
        }
        //Check if poll found
        if (!poll) {
            return res.status(404).json({ message: "Poll not found." });
        }

        //Process vote
        const result = await vote(userId, pollId, selectedOption);
        res.status(201).json(result);
    } catch (error: any) {
        console.error("❌ Error during vote processing:", error.message);
        if (error.message.includes("Poll not found") || error.message.includes("Invalid option")) {
            return res.status(404).json({ message: error.message });
        }

        next(error);
    }
});

export default router;
