import { addDailyRecordService, getDailyRecordService } from '../services/recordService.js';
import { response } from '../../config/response.js';
import { DailyRecordDTO } from '../dtos/recordDTO.js';


// 새로운 일일 기록을 추가하는 컨트롤러 함수
export const addDailyRecord = async (req, res) => {
    try {
        const recordId = await addDailyRecordService(req.body);
        res.status(201).json(response({ isSuccess: true, code: 201, message: 'Daily record added successfully' }, { recordId }));
    } catch (error) {
        res.status(error.data?.code || 500).json(response({ isSuccess: false, code: error.data?.code || 500, message: error.message }));
    }
};

// 특정 날짜의 일일 기록을 조회하는 컨트롤러 함수
export const getDailyRecord = async (req, res) => {
    try {
        const record = await getDailyRecordService(req.params.userId, req.query.date);
        res.status(200).json(response({ isSuccess: true, code: 200, message: 'Daily record fetched successfully' }, DailyRecordDTO(record)));
    } catch (error) {
        res.status(error.data?.code || 500).json(response({ isSuccess: false, code: error.data?.code || 500, message: error.message }));
    }
};
