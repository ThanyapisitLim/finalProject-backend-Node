import express, { Request, Response, NextFunction } from 'express';
import { getVoteByUserId } from '../../controller/vote';
const router = express.Router();

/* GET users listing. */
router.get('/:userId', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId;
        // Fetch votes by userId from the database
        const getPoll = await getVoteByUserId(userId);
        res.status(200).json(getPoll);
    } catch (error) {
        next(error);
    }
});

export default router;