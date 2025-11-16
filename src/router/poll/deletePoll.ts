import express, { Request, Response, NextFunction } from 'express';
import { deletePoll, getPollByPollId } from '../../controller/poll';
import { deleteVoteByPollId } from '../../controller/vote';
const router = express.Router();

/* GET users listing. */
router.post('/', async function(req: Request, res: Response, next: NextFunction) {
    try {
    const pollId = req.body.pollId;
    if (!pollId) {
        res.status(400).json({ error: "pollId is required" });
        return;
    }
    const check = await getPollByPollId(pollId);
    if (!check) {
        res.status(404).json({ error: "Poll not found" });
        return;
    }
    const deletedPoll = await deletePoll(pollId);
    if (!deletedPoll) {
        res.status(404).json({ error: "Poll not found or could not be deleted" });
        return;
    }
    await deleteVoteByPollId(pollId);
    res.json({ message: `Poll with ID ${pollId} has been deleted.` });
    } catch (error) {
        next(error);
    }
});

export default router;