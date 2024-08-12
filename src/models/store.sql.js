//(3.4 / 3.4.2 / 3.4.3)
export const getHotStoreQuery = (cursorId, regions, type, { open, close }) => {
    let query = `
        SELECT s.id, s.name, s.address, o.${open} AS open, o.${close} AS close, r.avg AS rating, s.image
        FROM store s
        JOIN open o ON s.id = o.store_id
        JOIN store_rating r ON s.id = r.store_id
        WHERE s.id IN (
            SELECT store_id
            FROM store_savning
            GROUP BY store_id
            HAVING COUNT(user_id) >= 5
        )
    `;
// 위에 >= 뒤 숫자로 hot식당의 세이브닝개수 기준 변경


    if (regions && regions.length > 0) {
        const likeClauses = regions.map(() => `s.address LIKE ?`).join(' OR ');
        query += ` AND (${likeClauses})`;
    }

    if (type) {
        query += ` AND s.type = ?`;
    }

    if (cursorId) {
        query += ` AND s.id > ?`;
    }

    query += ` ORDER BY s.id ASC LIMIT ?`;

    
    return query;
};

//-------------------------------------------------------------

//평균별점, 비건타입, hot태그, 주소, 영업시간 ,홈페이지, 연락처
export const getStoreInfoQuery = `
    SELECT
        s.name,
        sr.avg,
        s.type,
        s.address,
        s.link,
        s.contact,
        COUNT(r.id) AS review_count,
        o.mon_open, o.mon_close,
        o.tue_open, o.tue_close,
        o.wed_open, o.wed_close,
        o.thu_open, o.thu_close,
        o.fri_open, o.fri_close,
        o.sat_open, o.sat_close,
        o.sun_open, o.sun_close
    FROM store s
    LEFT JOIN store_rating sr ON s.id = sr.store_id
    LEFT JOIN open o ON s.id = o.store_id
    LEFT JOIN store_review r ON s.id = r.store_id
    WHERE s.id = ?
    GROUP BY s.id, sr.avg, s.type, s.address, s.link, s.contact,
             o.mon_open, o.mon_close, o.tue_open, o.tue_close,
             o.wed_open, o.wed_close, o.thu_open, o.thu_close,
             o.fri_open, o.fri_close, o.sat_open, o.sat_close,
             o.sun_open, o.sun_close;
`;

// 가게 리뷰 사진을 가져오는 쿼리
export const getStoreReviewPhotoQuery = `
    SELECT image
    FROM store_review
    WHERE store_id = ? AND image IS NOT NULL
    LIMIT 6
`;


// 가게 메뉴를 가져오는 쿼리
export const getStoreMenuQuery = `
    SELECT menu, price
    FROM menu
    WHERE store_id = ?`;

export const getIsHotQuery = `
    SELECT COUNT(*) as count
    FROM store_savning
    WHERE store_id = ?`;
//--------------------------------------------------------------


//식당리뷰페이지 별점정보
//(3.7.2)
export const getStoreRateQuery = `
    SELECT 
        avg AS average,
        five,
        four,
        three,
        two,
        one
    FROM 
        store_rating
    WHERE 
        store_id = ?
`;

export const getReviewCountQuery = `
SELECT 
    COUNT(*) AS review_count
FROM 
    store_review
WHERE 
    store_id = ?;
`;
// SELECT 
//         review_count
//     FROM 
//         store
//     WHERE 
//         id = ?


//-----------------------------------------------------------------------------
//식당리뷰등록
//(3.7.3)
// 리뷰 추가 쿼리
export const addReviewQuery = `
    INSERT INTO store_review (store_id, user_id, image, rating, body, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
`;

// 가게 평점 업데이트 쿼리
export const updateStoreRatingQuery = `
    UPDATE store_rating
    SET avg = ?
    WHERE store_id = ?
`;
