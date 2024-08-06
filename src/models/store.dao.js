import { pool } from "../../config/db.config.js";
import { getHotStoreQuery } from "./store.sql.js";
import { isStoreOpen, getOpenCloseColumns } from "./module.js";

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
