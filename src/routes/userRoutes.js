import express from 'express';
import { getUser } from '../controllers/userController.js';
import { getUserChallengeByDate } from '../controllers/ChallengeController.js';
import { updateUserChallenge } from '../controllers/ChallengeController.js';
import { getDailyRecordByDate } from '../controllers/recordController.js';

const router = express.Router();

// 사용자의 정보
router.get('/:userId', getUser);

// 오늘날짜의 챌린지 정보가져옴
router.get('/:userId/challenge/:date?', (req, res, next) => {
    let { date } = req.params;

    // date 파라미터가 없으면 오늘 날짜를 기본값으로 설정
    if (!date) {
        const today = new Date();
        date = today.toISOString().split('T')[0];  // YYYY-MM-DD 형식으로 변환
    }

    // req.query에 날짜를 추가하고 다음 미들웨어로 넘김
    req.query.date = date;
    next();
}, getUserChallengeByDate);

// 특정 날짜의 일일 기록을 가져옴
router.get('/:userId/daily-records', getDailyRecordByDate);

// 사용자의 챌린지정보 업데이트
router.post('/challenge', updateUserChallenge);
export default router;