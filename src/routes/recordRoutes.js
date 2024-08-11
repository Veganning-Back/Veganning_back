import express from 'express';
import { addDailyRecord, getDailyRecord } from '../controllers/recordController.js';

const router = express.Router();

// 일일 기록을 추가하는 API 엔드포인트 (PUT /daily-record/select)
router.put('/select', addDailyRecord);

// 특정 날짜의 일일 기록을 가져오는 API 엔드포인트 (GET /daily-record/:userId/daily-records)
router.get('/:userId/daily-records', getDailyRecord);

export default router;
