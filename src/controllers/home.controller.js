import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { hotStores } from "../services/home.service.js";
import { recommendRecipesService } from "../services/home.service.js";


//(3.1.1 / 3.1.2 / 3.1.3)
export const recommendRecipe = async (req, res) => {
    try {
        const { userId } = req.params;
        let { ingredients } = req.query;

        if (!userId) {
            return res.status(400).json(response(status.BAD_REQUEST, 'No userId provided'));
        }

        if (!ingredients) {
            ingredients = [];
        }

        

        // ingredients가 문자열인 경우 배열로 변환
        if (typeof ingredients === 'string') {
            ingredients = [ingredients];
        }

        const result = await recommendRecipesService(userId, ingredients);

        return res.status(200).json(result); //리턴

    } catch (error) {
        console.error(error);
        return res.status(500).json(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};


//(3.1.4)
export const showHotStores = async (req, res, next) => {
    try {
        const stores = await hotStores(); // await를 사용하여 비동기 함수를 호출
        
        return res.status(200).json(response(status.SUCCESS, stores.data)); // 응답 객체를 수정
    } catch (error) {
        console.error(error);
        return res.status(500).json(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};