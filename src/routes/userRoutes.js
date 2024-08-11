import express from 'express';
import { getUser, updateUserTargets } from '../controllers/userController.js';

const router = express.Router();

// 사용자의 정보를 가져오는 API 엔드포인트 (GET /users/:userId)
router.get('/:userId', getUser);

// 사용자의 목표 영양소 섭취량을 업데이트하는 API 엔드포인트 (POST /users/challenge/:userId)
router.post('/challenge/:userId', updateUserTargets);

export default router;
