import express from 'express';
import { addDailyRecord } from '../controllers/recordController.js';
import { calculateNutrients } from '../controllers/recordController.js';

const router = express.Router();

// 일일 기록을 추가
router.put('/select', addDailyRecord);

// 목표 영양소 계산 
router.post('/calculate', calculateNutrients);

export default router;