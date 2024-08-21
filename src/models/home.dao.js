import { pool } from "../../config/db.config.js";
import { status } from "../../config/response.status.js";
import { getHotStoresQuery, getUserData, getRecommendationQuery, getRandomRecipe, getHotRecipeQuery } from "./home.sql.js";
import {isStoreOpen, getOpenCloseColumns} from "./module.js";

// (3.1.4)세이브닝 개수가 가장 많은 4개의 식당 정보 리턴
export const getHotStoresData = async () => {
    try {
        const conn = await pool.getConnection();

        const today = new Date().getDay();
        const openCloseColumns = getOpenCloseColumns(today);

        // 쿼리 실행
        const [rows] = await conn.query(getHotStoresQuery(openCloseColumns));

        console.log(getHotStoresQuery(openCloseColumns));

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
        console.log(userId, ingredients);
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
        
        console.log(recipeRows[0]);
        
        
        return { user: userRows[0], recommend: recipeRows };

    } catch (err) {
        console.error(err);
        throw new Error("Failed to get recommended recipes");
    }
};



//(3.1.6)
export const getHotRecipe = async () => {
    try {
        const conn = await pool.getConnection();

        // Get a random recipe
        const [recipe] = await conn.query(getHotRecipeQuery());

        // Check if the recipe is hot (saved 5 or more times)
        const [savningCount] = await conn.query('SELECT COUNT(*) as count FROM recipe_savning WHERE recipe_id = ?', [recipe[0].id]);
        const isHot = savningCount.count >= 5;

        // Format the response
        const responseBody = {
            recipe_id: recipe[0].id,
            name: recipe[0].name,
            isHot: isHot,
            type: recipe[0].type,
            sequence_1: recipe[0].sequence_1,
            sequence_2: recipe[0].sequence_2,
            image: recipe[0].image ? Buffer.from(recipe[0].image).toString('base64') : null,
        };

        conn.release();
        console.log(responseBody);
        return responseBody;
    } catch (error) {
        console.error('Error fetching hot recipe:', error);
        throw error;
    }
};