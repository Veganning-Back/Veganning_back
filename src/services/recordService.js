import { addDailyRecord, getDailyRecordByDate } from '../models/recordModel.js';
import { BaseError } from '../../config/error.js';

// 새로운 일일 기록을 추가하는 서비스 함수
export const addDailyRecordService = async (data) => {
    const recordId = await addDailyRecord(data);
    if (!recordId) {
        throw new BaseError({ message: 'Failed to add daily record', code: 500 });  // 추가 실패 시 에러 발생
    }
    return recordId;
};

// 특정 날짜에 해당하는 일일 기록을 조회하는 서비스 함수
export const getDailyRecordService = async (userId, date) => {
    const record = await getDailyRecordByDate(userId, date);
    if (!record) {
        throw new BaseError({ message: 'Record not found', code: 404 });  // 기록이 없으면 에러 발생
    }
    return record;
};
