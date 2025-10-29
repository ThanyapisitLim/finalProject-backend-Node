import express, { Request, Response, NextFunction } from 'express';
import { getUserIdByUsername, loginCheck } from '../../controller/users';
const router = express.Router();

/* POST login */
router.post('/', async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }
        const loginResult = await loginCheck(username, password);
        switch (loginResult) {
            case "Login successful": {
                const userId = await getUserIdByUsername(username);
                return res.status(200).json({ message: "Login successful", userId });
            }
            case "Username not found":
                return res.status(404).json({ message: "Username not found" });
            case "Password incorrect":
                return res.status(401).json({ message: "Password incorrect" });
            default:
                return res.status(401).json({ message: "Invalid username or password" });
        }
    } catch (error) {
        next(error);
    }
});

export default router;