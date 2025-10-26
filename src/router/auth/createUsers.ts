import express, { Request, Response, NextFunction } from 'express';
import { createUserCheck, storeUser } from '../../controller/users';
const router = express.Router();

/* GET users listing. */
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const createUserResult = await createUserCheck(username);
        if (createUserResult === "Username already exists") {
            return res.status(409).json({ message: "Username already exists" });
        }
        const userId = await storeUser(username, password);
        res.status(201).json({ userId });
    } catch (error) {
        next(error);
    }
});
export default router;