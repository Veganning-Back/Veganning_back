import express from 'express';
import { getUser } from '../controllers/userController.js';
import { getUserChallengeByDate } from '../controllers/ChallengeController.js';
import { updateUserChallenge } from '../controllers/ChallengeController.js';
import { getDailyRecordByDate } from '../controllers/recordController.js';

const router = express.Router();

// 사용자의 정보
router.get('/:userId', getUser);

// 특정 날짜의 챌린지 정보가져옴
router.get('/:userId/challenge/:date', getUserChallengeByDate);

// 특정 날짜의 일일 기록을 가져옴
router.get('/:userId/daily-records', getDailyRecordByDate);

// 사용자의 챌린지정보 업데이트
router.post('/challenge', updateUserChallenge);
export default router;