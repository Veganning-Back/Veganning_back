import { getUserById, updateUserTargets } from '../models/userModel.js';
import { BaseError } from '../../config/error.js';

// 사용자 정보를 조회하는 서비스 함수
export const getUserService = async (userId) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new BaseError({ message: 'User not found', code: 404 });  // 사용자가 없으면 에러 발생
    }
    return user;
};

// 사용자의 목표 영양소 섭취량을 업데이트하는 서비스 함수
export const updateUserTargetsService = async (userId, targets) => {
    const rowsAffected = await updateUserTargets(userId, targets);
    if (rowsAffected === 0) {
        throw new BaseError({ message: 'Failed to update targets', code: 500 });  // 업데이트 실패 시 에러 발생
    }
    return rowsAffected;
};
