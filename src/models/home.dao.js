import { pool } from "../../config/db.config.js";
import { status } from "../../config/response.status.js";
import { getHotStoresQuery } from "./home.sql.js";
import {isStoreOpen, getOpenCloseColumns} from "./home.module.js";

// 세이브닝 개수가 가장 많은 4개의 식당 정보 리턴
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

        // 연결 반환
        conn.release();
       
        return  hotStores;
    } 
    catch (err) {
        console.error(err);
        return { status: status.FAIL, data: null };
    }
}


