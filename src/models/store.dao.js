import { pool } from "../../config/db.config.js";
import { getHotStoreQuery, 
    getStoreInfoQuery, getStoreReviewPhotoQuery, getStoreMenuQuery, getIsHotQuery, getStoreRateQuery, getReviewCountQuery, 
    addReviewQuery, updateStoreRatingQuery } from "./store.sql.js";
import { isStoreOpen, getOpenCloseColumns } from "./module.js";


//(3.4 / 3.4.2 / 3.4.3)
export const getHotStoreList = async (cursorId, region, type, limit) => {
    try {
        const conn = await pool.getConnection();
        
        const today = new Date().getDay();
        const openCloseColumns = getOpenCloseColumns(today);

        // region을 배열로 처리
        const regions = region ? region.split(',') : [];
        const regionParams = regions.map(region => `%${region}%`);

        // SQL 쿼리 생성
        const query = getHotStoreQuery(cursorId, regions, type, openCloseColumns);
        const params = [
            ...regionParams,
            type ? type : null,
            cursorId ? parseInt(cursorId, 10) : null,
            parseInt(limit, 10)
        ].filter(param => param !== null); // null 값을 제외한 파라미터만 전달

        // console.log("SQL Query:", query);
        // console.log("Params:", params);

        const [storeRows] = await conn.query(query, params);

        

        const hotStoreList = storeRows.map(store => ({
            id: store.id,
            name: store.name,
            address: store.address,
            open: `${store.open} ~ ${store.close}`,
            rating: store.rating,
            isOpen: isStoreOpen(store.open, store.close),
            image: store.image
        }));

        conn.release();
        
        return hotStoreList;
    } catch (error) {
        console.error("DAO Error:", error);
        throw error;
    }
};


// 식당 상세페이지
// (3.6.2 / 3.6.3 / 3.6.4 / 3.6.6 / 3.6.8 / 3.6.9)
export const getStoreById = async (storeId) => {
    try {
        const conn = await pool.getConnection();
        console.log("Database connection established");

        // 평균별점, 비건타입, 주소, 영업시간, 홈페이지, 연락처 가져오기
        const [storeInfoRows] = await conn.query(getStoreInfoQuery, [storeId]);
        
        if (storeInfoRows.length === 0) {
            throw new Error("Store not found");
        }
        const storeData = storeInfoRows[0];

        // 사진 리뷰에 있는 사진 6개 가져오기
        const [photoRows] = await conn.query(getStoreReviewPhotoQuery, [storeId]);
        
        const photoList = photoRows.length > 0 ? photoRows : [];

        // 메뉴 가져오기
        const [menuRows] = await conn.query(getStoreMenuQuery, [storeId]);
        
        const menuList = menuRows.length > 0 ? menuRows : [];

        // 해당 가게가 hot 상태인지 확인
        const [savingCountRows] = await conn.query(getIsHotQuery, [storeId]);
        
        const isHot = savingCountRows[0].count > 10;

        // 영업시간을 "09:00~21:00" 형태로 변환
        const openHours = [
            `월요일: ${storeData.mon_open}~${storeData.mon_close}`,
            `화요일: ${storeData.tue_open}~${storeData.tue_close}`,
            `수요일: ${storeData.wed_open}~${storeData.wed_close}`,
            `목요일: ${storeData.thu_open}~${storeData.thu_close}`,
            `금요일: ${storeData.fri_open}~${storeData.fri_close}`,
            `토요일: ${storeData.sat_open}~${storeData.sat_close}`,
            `일요일: ${storeData.sun_open}~${storeData.sun_close}`
        ];

        // 데이터를 객체로 묶기
        const store = {
            ...storeData,
            isHot: isHot,
            open: openHours,
            photo: photoList,
            menu: menuList
        };

        

        conn.release();
        
        return store;
    } catch (error) {
        console.error("Service error:", error);
        throw error; // 오류를 다시 던져서 호출한 쪽에서 처리하게 함
    }
};


//식당리뷰페이지 별점정보
//(3.7.2)
export const getStoreRateById = async (storeId) => {
    try {
        const conn = await pool.getConnection();

        const [rateData] = await conn.query(getStoreRateQuery, [storeId]);
        const [reviewCountData] = await conn.query(getReviewCountQuery, [storeId]);

        conn.release();

        return {
            ...rateData[0],
            review_count: reviewCountData[0].review_count
        };
    } 
    
    catch (error) {
        console.log("DAO 파일이 아예 실행이 안되고있음:", error);
        throw error;
    }
};



//식당리뷰등록
//(3.7.3)
// 리뷰 추가 DAO
export const addReviewDAO = async (storeId, userId, image, rating, body) => {
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const [result] = await conn.query(addReviewQuery, [storeId, userId, image, rating, body]);
        //const [reviewData] = await conn.query("SELECT * FROM store_review WHERE id = ?", [result.insertId]);

        await conn.commit();
        // return reviewData[0];
        return ;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
};

// 가게 평점 업데이트 DAO
export const updateStoreRatingDAO = async (storeId) => {
    const conn = await pool.getConnection();

    try {
        const [ratings] = await conn.query("SELECT rating FROM store_review WHERE store_id = ?", [storeId]);

        const totalRatings = ratings.length;
        const sumRatings = ratings.reduce((acc, curr) => acc + curr.rating, 0);
        const avgRating = (sumRatings / totalRatings).toFixed(2);

        await conn.query(updateStoreRatingQuery, [avgRating, storeId]);
    } catch (error) {
        throw error;
    } finally {
        conn.release();
    }
};