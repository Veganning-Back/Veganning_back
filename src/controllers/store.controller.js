import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { hotStoreListService} from "../services/store.service.js";

//(3.4 / 3.4.2 / 3.4.3)
export const showHotStoreList = async (req, res) =>{
    try{
        const {cursorId} = req.params; //이번 호출의 첫번째 식당의 id
        let { region, type, limit } = req.query; //uri의 쿼리스트링 저장

        console.log("콘트롤러");
        

        const result = await hotStoreListService(cursorId, region, type, limit);

        return res.status(200).json(result);
        
    } catch{

    }
}