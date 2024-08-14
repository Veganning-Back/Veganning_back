import { addDailyRecordService, getDailyRecordService } from '../services/recordService.js';
import { pool } from '../../config/db.config.js';
import { BaseError } from '../../config/error.js';

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
        res.status(200).json({
            isSuccess: true,
            code: 200,
            message: 'Record fetched successfully',
            data: record
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
export const calculateNutrients = (req, res) => {
    const { target_carb, target_protein, target_fat } = req.body;

    if (target_carb == null || target_protein == null || target_fat == null) {
        return res.status(400).json({ isSuccess: false, code: 400, message: 'All fields are required' });
    }

    try {
        const target_carb_cal = target_carb * 4; 
        const target_protein_cal = target_protein * 4; 
        const target_fat_cal = target_fat * 9; 
        const target_cal = target_carb_cal + target_protein_cal + target_fat_cal; 

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


