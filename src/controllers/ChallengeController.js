import {pool} from '../../config/db.config.js'; 

// 사용자의 챌린지 목표를 업데이트하는 함수
export const updateUserChallenge = async (req, res) => {
    const { userId, target_carbs, target_protein, target_fat, target_cal } = req.body;

    if (!userId || target_carbs == null || target_protein == null || target_fat == null || target_cal == null) {
        return res.status(400).json({ isSuccess: false, code: 400, message: 'All fields are required' });
    }

    try {
        const result = await pool.query(`
            UPDATE User SET target_carbs = ?, target_protein = ?, target_fat = ?, target_cal = ? WHERE userId = ?
        `, [target_carbs, target_protein, target_fat, target_cal, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ isSuccess: false, code: 404, message: 'User not found' });
        }

        res.status(200).json({ isSuccess: true, code: 200, message: 'User targets updated successfully' });
    } catch (error) {
        res.status(500).json({ isSuccess: false, code: 500, message: error.message });
    }
};


// 특정 날짜의 일일 기록을 가져오는 함수
export const getUserChallengeByDate = async (req, res) => {
    const { userId, date } = req.params;

    try {
       
        const [rows] = await pool.query(`
            SELECT user_id, date, today_meal, today_carbs, today_protein, today_fat, stamp
            FROM daily_record
            WHERE user_id = ? AND date = ?
        `, [userId, date]);

        // 일일 기록이 있는지 확인
        if (rows.length === 0) {
            return res.status(404).json({ isSuccess: false, code: 404, message: 'Record not found' });
        }

        res.status(200).json({ isSuccess: true, code: 200, data: rows[0] });
    } catch (error) {
        console.error('Error fetching daily record:', error);
        res.status(500).json({ isSuccess: false, code: 500, message: error.message });
    }
};

