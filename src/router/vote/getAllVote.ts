import express, { Request, Response, NextFunction } from 'express';
import { get } from 'mongoose';
import { getAllVote } from '../../controller/vote';
const router = express.Router();

/* GET users listing. */
router.get('/', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const votes = await getAllVote();
        res.json(votes);
    } catch (error) {
        next(error);
    }
});

export default router;