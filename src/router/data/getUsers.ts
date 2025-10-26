import express, { Request, Response, NextFunction } from 'express';
import { getUserById } from '../../controller/users';
const router = express.Router();

/* GET users listing. */
router.get('/:userId', async function (req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId as string;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

export default router;