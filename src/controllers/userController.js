import { getUserService, updateUserTargetsService } from '../services/userService.js';
import { response } from '../../config/response.js';
import { UserDTO } from '../dtos/UserDTO.js';

// 사용자 정보를 조회
export const getUser = async (req, res) => {
    try {
        const user = await getUserService(req.params.userId);
        res.status(200).json(response({ isSuccess: true, code: 200, message: 'User fetched successfully' }, UserDTO(user)));
    } catch (error) {
        res.status(error.data?.code || 500).json(response({ isSuccess: false, code: error.data?.code || 500, message: error.message }));
    }
};

// 사용자의 목표 영양소 섭취량을 업데이트
export const updateUserTargets = async (req, res) => {
    try {
        await updateUserTargetsService(req.params.userId, req.body);
        res.status(200).json(response({ isSuccess: true, code: 200, message: 'User targets updated successfully' }));
    } catch (error) {
        res.status(error.data?.code || 500).json(response({ isSuccess: false, code: error.data?.code || 500, message: error.message }));
    }
};
