import { pool } from '../../config/db.config.js';

// 새로운 일일 기록을 추가하는 함수
export const addDailyRecord = async (data) => {
    const { user_id, date, today_meal, today_carbs, today_protein, today_fat, calorie, stamp } = data;
    const [result] = await pool.query(`
        INSERT INTO daily_record (user_id, date, today_meal, today_carbs, today_protein, today_fat, calorie, stamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [user_id, date, today_meal, today_carbs, today_protein, today_fat, calorie, stamp]);
    return result.insertId;  // 생성된 일일 기록의 ID를 반환
};

// 특정 날짜에 해당하는 사용자의 일일 기록을 조회하는 함수
export const getDailyRecordByDate = async (userId, date) => {
    const [rows] = await pool.query(`
        SELECT * FROM daily_record WHERE user_id = ? AND date = ?
    `, [userId, date]);
    return rows[0];  // 첫 번째 기록을 반환
};
