import express, { Request, Response, NextFunction } from 'express';
import { vote } from '../../controller/vote';
const router = express.Router();

router.post('/', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId, pollId, selectedOption } = req.body;
        const result = await vote(userId, pollId, selectedOption);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

export default router;