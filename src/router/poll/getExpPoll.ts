import express, { Request, Response, NextFunction } from 'express';
import { getAllExpPoll } from '../../controller/poll';
const router = express.Router();

/* GET users listing. */
router.get('/', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const allPolls = await getAllExpPoll();
    console.log("All active expire poll : ", allPolls);
    res.json(allPolls);
  } catch (error) {
    next(error);
  }
});

export default router;