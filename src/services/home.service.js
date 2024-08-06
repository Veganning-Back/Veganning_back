
import { showHotStoresResponseDTO, recommendRecipesResponseDTO } from "../dtos/home.dto.js";
import {getHotStoresData, getRecommendRecipe} from "../models/home.dao.js";
import { formatDate } from "../models/module.js";
//dao : 쿼리문 조작   dto : 프론트에 적절한 형태로 데이터 조작

//(3.1.1 / 3.1.2 / 3.1.3)
export const recommendRecipesService = async (userId, ingredients) => {
    const data = await getRecommendRecipe(userId, ingredients);
    const todayDate = formatDate(new Date());
    
    return recommendRecipesResponseDTO(todayDate, data);
};




//(3.1.4)
export const hotStores = async () => {
    
    
    //showHotStoresResponseDTO : 적절한형태로 만듦
    return showHotStoresResponseDTO(await getHotStoresData()); //getHotStores : 세이브닝 개수 가장많은 4개 리턴
                                          //join사용해야함
}