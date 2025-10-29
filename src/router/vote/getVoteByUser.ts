import express, { Request, Response, NextFunction } from 'express';
import { getVoteByUserId } from '../../controller/vote';
const router = express.Router();

/* GET users listing. */
router.get('/:userId', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        // Fetch votes by userId from the database
        const getPoll = await getVoteByUserId(userId);
        if (!getPoll) {
            return res.status(404).json({ message: 'Votes not found for the given user ID' });
        }
        if (getPoll.length === 0) {
            return res.status(200).json({ message: 'No votes found for the given user ID', votes: [] });
        }
        res.status(200).json(getPoll);
    } catch (error) {
        next(error);
    }
});

export default router;