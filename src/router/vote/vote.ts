import express, { Request, Response, NextFunction } from 'express';
import { checkVoteSelected, vote } from '../../controller/vote';
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

        //Check poll existence
        let poll;
        try {
            poll = await getPollByPollId(pollId);
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

        //Check selected option validity
        let isValidOption = false;
        try {
            // checkVoteSelected returns a boolean indicating whether the selected option is valid
            isValidOption = await checkVoteSelected({ selectedOption }, pollId);
        } catch (e) {
            console.error("❌ Error fetching poll for option validation:", e);
            return res.status(500).json({ message: "Internal server error while validating selected option." });
        }
        if (!isValidOption) {
            return res.status(404).json({ message: "Invalid option selected." });
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
