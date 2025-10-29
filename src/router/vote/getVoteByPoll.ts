import express, { Request, Response, NextFunction } from 'express';
import { getVotesByPollId } from '../../controller/vote';
const router = express.Router();

/* GET users listing. */
router.get('/:pollId', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const pollId = req.params.pollId;
        if (!pollId) {
            return res.status(400).json({ message: "Poll ID is required" });
        }
        // Fetch votes by pollId from the database
        const getVotes = await getVotesByPollId(pollId);
        if (!getVotes) {
            return res.status(404).json({ message: 'Votes not found for the given poll ID' });
        }
        if (getVotes.length === 0) {
            return res.status(200).json({ message: 'No votes found for the given poll ID', votes: [] });
        }
        res.status(200).json(getVotes);
    } catch (error) {
        next(error);
    }
});

export default router;