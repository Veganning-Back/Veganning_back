import { hotStoreListDTO, showStoreDTO, showStoreRateDTO, createReviewDTO } from "../dtos/store.dto.js";
import { getHotStoreList, getStoreById, getStoreRateById, addReviewDAO, updateStoreRatingDAO } from "../models/store.dao.js";


//(3.4 / 3.4.2 / 3.4.3)
export const hotStoreListService = async (cursorId, region, type, limit) => {
    

    let storeData = [];
    let nextCursorId = cursorId;

    try {
        
        storeData = await getHotStoreList(cursorId, region, type, limit);
        
        if (storeData && storeData.length > 0) {
            nextCursorId = storeData[storeData.length - 1].id;
            
        }
        
    } catch (error) {
        console.error("Service Error:", error);
    }
    
    
    return hotStoreListDTO(nextCursorId, storeData, parseInt(limit, 10));
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
        await updateStoreRatingDAO(storeId);

        // DTO 생성
        // return createReviewDTO(reviewData);
        return ;
    } 
    
    catch (error) {
        throw error;
    }
};