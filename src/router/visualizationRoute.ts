import express from 'express';
import { visualizeAllVotes } from '../controller/visualization'; // 👈 import controller ใหม่

const router = express.Router();

router.get('/', visualizeAllVotes);

export default router;