import { hotStoreListDTO } from "../dtos/store.dto.js";
import { getHotStoreList } from "../models/store.dao.js";

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
