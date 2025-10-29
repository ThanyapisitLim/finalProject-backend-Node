import express, { Request, Response, NextFunction } from 'express';
import { getAllActivePoll } from '../../controller/poll';
const router = express.Router();

/* GET users listing. */
router.get('/', async function(req: Request, res: Response, next: NextFunction) {
  const allPolls = await getAllActivePoll();
  console.log(allPolls);
  res.json(allPolls);
});

export default router;