import { getUserById, updateUserTargets } from '../models/userModel.js';
import { BaseError } from '../../config/error.js';
import { pool } from '../../config/db.config.js';

// 사용자 정보를 조회
export const getUserService = async (userId) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new BaseError({ message: 'User not found', code: 404 });  
    }
    return user;
};

// 사용자의 목표 영양소를 조회
export const getUserTargetsService = async (userId) => {
    const [rows] = await pool.query(`
        SELECT target_carb, target_protein, target_fat, target_cal
        FROM user
        WHERE userId = ?
    `, [userId]);

    if (rows.length === 0) {
        throw new BaseError({ message: 'User not found', code: 404 });
    }
    
    return rows[0];
};

// 사용자의 목표 영양소 섭취량을 업데이트
export const updateUserTargetsService = async (userId, targets) => {
    const rowsAffected = await updateUserTargets(userId, targets);
    if (rowsAffected === 0) {
        throw new BaseError({ message: 'Failed to update targets', code: 500 });  
    }
    return rowsAffected;
};