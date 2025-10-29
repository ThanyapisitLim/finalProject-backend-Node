import express, { Request, Response, NextFunction } from 'express';
import { getVotesByPollId } from '../../controller/vote';
const router = express.Router();

/* GET users listing. */
router.get('/:pollId', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const pollId = req.params.pollId;
        // Fetch votes by pollId from the database
        const getVotes = await getVotesByPollId(pollId);
        res.status(200).json(getVotes);
    } catch (error) {
        next(error);
    }
});

export default router;