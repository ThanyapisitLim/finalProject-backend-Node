import express, { Request, Response, NextFunction } from 'express';
import { getPollByUserId } from '../../controller/poll';
const router = express.Router();

/* GET users listing. */
router.get('/:userId', async function (req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId;
        const poll = await getPollByUserId(userId);
        res.json(poll);
    } catch (error) {
        next(error);
    }
});

export default router;