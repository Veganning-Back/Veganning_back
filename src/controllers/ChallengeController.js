import { getDailyRecordService } from '../services/recordService.js';
import { pool } from '../../config/db.config.js';
import { getUserTargetsService } from '../services/userService.js';

// 사용자의 챌린지 목표를 업데이트하는 함수
export const updateUserChallenge = async (req, res) => {
    const { userId, target_carb, target_protein, target_fat, target_cal } = req.body;

    if (!userId || target_carb == null || target_protein == null || target_fat == null || target_cal == null) {
        return res.status(400).json({ isSuccess: false, code: 400, message: 'All fields are required' });
    }

    try {
        const result = await pool.query(`
            UPDATE user SET target_carb = ?, target_protein = ?, target_fat = ?, target_cal = ? WHERE userId = ?
        `, [target_carb, target_protein, target_fat, target_cal, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ isSuccess: false, code: 404, message: 'User not found' });
        }

        res.status(200).json({ isSuccess: true, code: 200, message: 'User targets updated successfully' });
    } catch (error) {
        res.status(500).json({ isSuccess: false, code: 500, message: error.message });
    }
};


// 오늘날짜의 일일 기록을 가져오는 함수
export const getUserChallengeByDate = async (req, res) => {
    try {
        const { userId } = req.params;
        let { date } = req.query;

        // date가 없을 경우 오늘 날짜로 설정
        if (!date) {
            const today = new Date();
            date = today.toISOString().split('T')[0];  // YYYY-MM-DD 형식으로 변환
        }

        const record = await getDailyRecordService(userId, date);
        if (!record) {
            return res.status(404).json({
                isSuccess: false,
                code: 404,
                message: 'Record not found'
            });
        }

        // 사용자 목표 정보 조회
        const userTargets = await getUserTargetsService(userId);
         // 현재 일일 기록의 총 칼로리 계산
         const totalCalories = record.today_carbs + record.today_protein + record.today_fat;
         // 목표 달성률 계산
        let achievementRate = 0;
        if (totalCalories >= userTargets.target_cal) {
            achievementRate = 1;
        } else if (totalCalories >= userTargets.target_cal * 0.7) {
            achievementRate = 0.7;
        } else if (totalCalories >= userTargets.target_cal * 0.5) {
            achievementRate = 0.5;
        }

        // 비율 계산 (today/target)
        const carbsRatio = (record.today_carbs / userTargets.target_carb).toFixed(2);
        const proteinRatio = (record.today_protein / userTargets.target_protein).toFixed(2);
        const fatRatio = (record.today_fat / userTargets.target_fat).toFixed(2);

        // stamp에 목표 달성률 추가
        const updatedRecord = {
            ...record,
            stamp: achievementRate
        };

       // 일일 기록과 목표 정보를 포함하여 응답
        res.status(200).json({
            isSuccess: true,
            code: 200,
            message: 'Record fetched successfully',
            data: {
                ...updatedRecord,
                target_carb: userTargets.target_carb,
                target_protein: userTargets.target_protein,
                target_fat: userTargets.target_fat,
                target_cal: userTargets.target_cal,
                carbs_ratio: carbsRatio,
                protein_ratio: proteinRatio,
                fat_ratio: fatRatio
            }
        });
    } catch (error) {
        console.error('Error fetching daily record:', error);
        res.status(500).json({ isSuccess: false, code: 500, message: error.message });
    }
};

