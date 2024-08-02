import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { hotStores } from "../services/home.service.js";

export const showHotStores = async (req, res, next) => {
    try {
        const stores = await hotStores(); // await를 사용하여 비동기 함수를 호출
        
        return res.status(200).json(response(status.SUCCESS, stores.data)); // 응답 객체를 수정
    } catch (error) {
        console.error(error);
        return res.status(500).json(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};
