import { pool } from "../../config/db.config.js";

// 새로운 일일 기록을 추가
export const addDailyRecord = async (data) => {
    const { user_id, date, today_meal, today_carbs, today_protein, today_fat, stamp, text } = data;
    try {
        const [result] = await pool.query(`
            INSERT INTO daily_record (user_id, date, today_meal, today_carbs, today_protein, today_fat, stamp, text)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [user_id, date, today_meal, today_carbs, today_protein, today_fat, stamp, text]);

        return result.insertId;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

// 특정 날짜에 해당하는 사용자의 일일 기록을 조회
export const getDailyRecordByDate = async (userId, date) => {
    try {
        const [rows] = await pool.query(`
            SELECT * FROM daily_record WHERE user_id = ? AND date = ?
        `, [userId, date]);
        return rows[0];  // 첫 번째 기록을 반환
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};