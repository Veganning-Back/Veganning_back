import { hotStoreListDTO, showStoreDTO, showStoreRateDTO, storeReviewDTO, showStoreImageDTO } from "../dtos/store.dto.js";
import { getHotStoreList, getStoreById, getStoreRateById, addReviewDAO, updateStoreRatingDAO, getStoreReivewList, savningStoreDAO, showStoreImageListDAO } from "../models/store.dao.js";


//(3.4 / 3.4.2 / 3.4.3)
export const hotStoreListService = async (region, type) => {
    

    let storeData = [];
    //let nextCursorId = cursorId;

    try {
        
        storeData = await getHotStoreList(region, type);
        
        // if (storeData && storeData.length > 0) {
        //     nextCursorId = storeData[storeData.length - 1].id;
            
        // }
        
    } catch (error) {
        console.error("Service Error:", error);
    }
    
    
    return hotStoreListDTO(storeData);
};

//식당 상세페이지
//(3.6.2 / 3.6.3 / 3.6.4 / 3.6.6 / 3.6.8 / 3.6.9)
export const showStoreService = async (storeId) => {
    try{
        const storeData = await getStoreById(parseInt(storeId, 10)); 

        const responseBody = await showStoreDTO(storeData);

        return responseBody; 
    } 
    
    catch{
        console.log("서비스파일이 실행되지않는 중");
    }

};


//식당리뷰페이지 별점정보
//(3.7.2)
export const showStoreRateService = async (storeId) => {
    try{
        const data = await getStoreRateById(parseInt(storeId, 10));

        const responseBody = await showStoreRateDTO(data);

        return responseBody;
    }

    catch{
        console.log("서비스파일이 실행되지않는 중");
    }
};


//식당리뷰등록
//(3.7.3)
export const addReviewService = async (storeId, userId, image, rating, body) => {
    try {
        // 리뷰 추가 DAO 호출
        const reviewData = await addReviewDAO(storeId, userId, image, rating, body);

        // 가게 평점 업데이트 DAO 호출
        await updateStoreRatingDAO(storeId, rating);

        
        return ;
    } 
    
    catch (error) {
        throw error;
    }
};


//식당 리뷰리스트
//(3.6.10 / 3.7 / 3.7.6)
export const showStoreReviewListService = async (storeId, order) => {
    let reviewData = [];
    
    try{
        
        reviewData = await getStoreReivewList(storeId, order);

        const result = await storeReviewDTO(reviewData);
        return result;

    }catch{
        console.log("서비스파일이 실행 안되는 중");
    }
};


//식당 세이브닝
//(3.9.6)
export const savningStoreService = async (user_id, store_id) =>{
    
    try{
        await savningStoreDAO(user_id, store_id);

        return ;
    }
    
    catch{
        throw error;
    }
};


//식당 사진리스트
//(3.8)
export const showStoreImageService = async (storeId) => {
    let imageData = [];

    try{
        
        imageData = await showStoreImageListDAO(storeId);
        
        const result = await showStoreImageDTO(imageData);
        
        
        return result;

    }catch{
        console.log("서비스 이상에서 오류");
    }
};