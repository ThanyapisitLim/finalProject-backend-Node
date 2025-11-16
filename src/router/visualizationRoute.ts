// src/router/visualization/visualizeAll.ts
import express from 'express';
import { visualizeAllVotes } from '../controller/visualization'; // 👈 import controller ใหม่

const router = express.Router();

router.get('/', visualizeAllVotes); // ใช้ Controller ที่สร้างขึ้น

export default router;