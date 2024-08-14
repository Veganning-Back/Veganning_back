import { pool } from '../../config/db.config.js';

export const getUserById = async (userId) => {
    const [rows] = await pool.query('SELECT * FROM user WHERE userId = ?', [userId]);
    return rows[0];  // 첫 번째 사용자 정보를 반환
};

// 특정 userId를 가진 사용자의 목표 영양소 섭취량을 업데이트
export const updateUserTargets = async (userId, targets) => {
    const { target_carb, target_protein, target_fat, target_cal } = targets;
    const [result] = await pool.query(`
        UPDATE user 
        SET target_carb = ?, target_protein = ?, target_fat = ?, target_cal = ?
        WHERE userId = ?
    `, [target_carb, target_protein, target_fat, target_cal, userId]);
    return result.affectedRows;  
};
