import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { hotStoreListService , showStoreService, showStoreRateService, addReviewService, showStoreReviewListService, savningStoreService, showStoreImageService} from "../services/store.service.js";

//(3.4 / 3.4.2 / 3.4.3)
export const showHotStoreList = async (req, res) =>{
    
    try{
        //const {cursorId} = req.params; //이번 호출의 첫번째 식당의 id
        let { region, type } = req.query; //uri의 쿼리스트링 저장

        
        
        
        const result = await hotStoreListService( region, type);
        // console.log(result);
        return res.status(200).json(result);
        
    } catch{

    }
};

//식당 상세페이지
//(3.6.2 / 3.6.3 / 3.6.4 / 3.6.6 / 3.6.8 / 3.6.9)
export const showStoreInfo = async (req, res) => {
    
    try{
        const storeId= req.params.storeId;
        
        const result = await showStoreService(storeId); //response Body

        return res.status(200).json(result);

    }catch{
        console.log("컨트롤러가 실행되지 않는 중");
    }
};


//식당리뷰페이지 별점정보
//(3.7.2)
export const showStoreRate = async (req, res) => {
    
    try{
        const storeId= req.params.storeId;
        console.log(storeId);
        const result = await showStoreRateService(storeId);

        return res.status(200).json(result);
    }

    catch{
        console.log("컨트롤러가 실행되지 않는 중");
    }
}

//식당리뷰등록
//(3.7.3)
export const addStoreReview = async (req, res) => {
    
    try {
        
        
        const { store_id, user_id, image, rating, body } = req.body;

        
        // 리뷰 추가 서비스 호출
        const review = await addReviewService(store_id, user_id, image, rating, body);

        return res.status(200).json(response(status.SUCCESS, "리뷰가 성공적으로 등록되었습니다.", review));
    } 
    catch (error) {
        console.error("리뷰 작성 중 오류 발생:", error);
        return res.status(500).json(response(status.SERVER_ERROR, "리뷰 작성 중 오류가 발생했습니다."));
    }
};

//식당 리뷰 무한스크롤
//(3.6.10 / 3.7 / 3.7.6)
export const showStoreReviewList = async (req, res) => {
    
    try{
        const storeId = req.params.storeId; //가게id
        const order = req.query.order

        const result = await showStoreReviewListService(parseInt(storeId, 10), order);

        return  res.status(200).json(result);

    }catch{
        console.log("콘트롤러 실행 안되는 중");
    }
};


//식당 세이브닝
//(3.9.6)
export const savningStore = async (req, res) => {
    try{
        const {user_id, store_id} = req.body;
        console.log(user_id, store_id);
        await savningStoreService(user_id, store_id);

        return res.status(200).json(response(status.SUCCESS, "세이브닝 성공"));
        

    }catch{
        
        return res.status(501).json(response(status.SERVER_ERROR, "세이브닝 실패 (컨트롤러)"));
    }
}

//식당 사진리스트
//(3.8)
export const showStoreImageList = async (req, res) => {
    
    try{
        const storeId = req.params.storeId;
        
        const data = await showStoreImageService(storeId);
        console.log(data);
        
        return res.status(200).json(data);
        
    }catch{
        console.log("컨트롤러 이상에소 오류");
    }
}