import { pool } from "../../config/db.config.js";
import { status } from "../../config/response.status.js";
import { getHotStoresQuery, getUserData, getRecommendationQuery, getRandomRecipe } from "./home.sql.js";
import {isStoreOpen, getOpenCloseColumns} from "./module.js";

// (3.1.4)세이브닝 개수가 가장 많은 4개의 식당 정보 리턴
export const getHotStoresData = async () => {
    try {
        const conn = await pool.getConnection();

        const today = new Date().getDay();
        const openCloseColumns = getOpenCloseColumns(today);

        // 쿼리 실행
        const [rows] = await conn.query(getHotStoresQuery(openCloseColumns));

        

        // 결과 포맷팅
        const hotStores = rows.map(store => ({
            id: store.id,
            name: store.name,
            address: store.address,
            open: `${store.open} ~ ${store.close}`,
            rating: store.avg,
            isOpen: isStoreOpen(store.open, store.close),
            image: store.image
        }));

        console.log(hotStores);
        

        // 연결 반환
        conn.release();
       
        return  hotStores;
    } 
    catch (err) {
        console.error(err);
        return { status: status.FAIL, data: null };
    }
}




export const getRecommendRecipe = async (userId, ingredients) => {
    try {
        const conn = await pool.getConnection();

        // 유저 이름과 D+Day를 가져오는 쿼리를 실행합니다.
        const [userRows] = await conn.query(getUserData(), [userId]);
        const user = userRows[0]; // 단일 결과를 가져옵니다.


        // 필터링 및 추천 레시피를 가져오는 쿼리 생성
        const placeholders = ingredients.map(() => '?').join(',');
        const query = getRecommendationQuery(placeholders, ingredients.length);
    

        let recipeRows;

        if(ingredients.length != 0){ 

        // 추천 레시피를 가져오는 쿼리를 실행합니다.
            [recipeRows] = await conn.query(query, [...ingredients, ingredients.length]);
        }
        
        else{//재료필터를 선택하지않은 경우
            [recipeRows] = await conn.query(getRandomRecipe());
        }
        



        // 데이터베이스 연결을 반환합니다.
        conn.release();
        
        
        
        
        return { user: userRows[0], recommend: recipeRows };

    } catch (err) {
        console.error(err);
        throw new Error("Failed to get recommended recipes");
    }
};