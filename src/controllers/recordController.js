import { addDailyRecordService, getDailyRecordService } from '../services/recordService.js';
import { pool } from '../../config/db.config.js';
import { BaseError } from '../../config/error.js';
import { UserDTO } from '../dtos/UserDTO.js';
import { getUserTargetsService } from '../services/userService.js';

// 새로운 일일 기록을 추가
export const addDailyRecord = async (req, res) => {
    const { userId, date, today_meal, record } = req.body;

    if (!userId || !date || today_meal == null || !record) {
        return res.status(400).json({ isSuccess: false, code: 400, message: 'Missing required fields' });
    }

    try {
        const { today_carbs, today_protein, today_fat } = record;

        if (today_carbs == null || today_protein == null || today_fat == null) {
            return res.status(400).json({ isSuccess: false, code: 400, message: 'Record fields cannot be null' });
        }

        // 데이터베이스에 추가
        const result = await pool.query(`
            INSERT INTO daily_record (user_id, date, today_meal, today_carbs, today_protein, today_fat)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [userId, date, today_meal, today_carbs, today_protein, today_fat]);

        res.status(201).json({ isSuccess: true, code: 201, message: 'Daily record added successfully', recordId: result.insertId });
    } catch (error) {
        console.error('Error adding daily record:', error);
        res.status(500).json({ isSuccess: false, code: 500, message: error.message });
    }
};



// 특정 날짜에 해당하는 사용자의 일일 기록을 조회
export const getDailyRecordByDate = async (req, res) => {
    try {
        const { userId } = req.params;
        const { date } = req.query;  

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
        res.status(error.data?.code || 500).json({
            isSuccess: false,
            code: error.data?.code || 500,
            message: error.message
        });
    }
};

// 목표 영양소를 계산
export const calculateNutrients = async (req, res) => {
    const { userId,target_carb, target_protein, target_fat } = req.body;

    if (target_carb == null || target_protein == null || target_fat == null) {
        return res.status(400).json({ isSuccess: false, code: 400, message: 'All fields are required' });
    }

    try {
        const target_carb_cal = target_carb * 4; 
        const target_protein_cal = target_protein * 4; 
        const target_fat_cal = target_fat * 9; 
        const target_cal = target_carb_cal + target_protein_cal + target_fat_cal; 

        // 데이터베이스에 저장
        const [result] = await pool.query(`
            INSERT INTO user (userId, name, target_carb, target_protein, target_fat, target_cal)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            target_carb = VALUES(target_carb),
            target_protein = VALUES(target_protein),
            target_fat = VALUES(target_fat),
            target_cal = VALUES(target_cal)
        `, [userId, 'defaultName', target_carb, target_protein, target_fat, target_cal]);
        

        res.status(200).json({
            isSuccess: true,
            code: 200,
            data: {
                target_carb: target_carb_cal,
                target_protein: target_protein_cal,
                target_fat: target_fat_cal,
                target_cal
            }
        });
    } catch (error) {
        console.error('Error calculating nutrients:', error);
        res.status(500).json({ isSuccess: false, code: 500, message: error.message });
    }
};

