import express, { Request, Response, NextFunction } from 'express';
import { getAllActivePoll } from '../../controller/poll';
const router = express.Router();

/* GET users listing. */
router.get('/', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const allPolls = await getAllActivePoll();
    console.log("All active poll : ", allPolls);
    res.json(allPolls);
  } catch (error) {
    next(error);
  }
});

export default router;