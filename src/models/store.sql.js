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
