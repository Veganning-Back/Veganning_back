import db from "../../congfig/db.config.js";


//레시피별 리뷰 리스트 조회
export const getRecipeReviewsDB = async (recipeId) => {
  const query = `
   SELECT rr.id, rr.body, rr.created_at, rr.rating, rr.user_id, rr.recipe_id, u.name as user_name
   FROM recipe_review rr
   JOIN user u ON rr.user_id = u.id
   WHERE rr.recipe_id = ?
`;

  const [rows] = await db.query(query, [recipeId]);
  return rows;
};

//레시피별 평균 별점, 별점 별 리뷰개수  조회
export const getRecipeRateDB = async (recipeId) => {
  const query = `
    SELECT 
      rr.recipe_id,
      AVG(rr.rating) AS average_rating,
      COUNT(rr.id) AS total_reviews,
      SUM(CASE WHEN rr.rating = 1 THEN 1 ELSE 0 END) AS one_star_count,
      SUM(CASE WHEN rr.rating = 2 THEN 1 ELSE 0 END) AS two_star_count,
      SUM(CASE WHEN rr.rating = 3 THEN 1 ELSE 0 END) AS three_star_count,
      SUM(CASE WHEN rr.rating = 4 THEN 1 ELSE 0 END) AS four_star_count,
      SUM(CASE WHEN rr.rating = 5 THEN 1 ELSE 0 END) AS five_star_count
    FROM 
      recipe_review rr
    WHERE 
      rr.recipe_id = ?
    GROUP BY
      rr.recipe_id
  `;
  try {
    const [rows] = await db.query(query, [recipeId]);
    return rows[0] || null; 
  } catch (error) {
    console.error("Database query failed: ", error);
    throw error;
  }
}

//리뷰 작성 + 총 리뷰개수, 점수별 리뷰 개수, 리뷰 평균 업데이트
export const addReviewDB = async (userId, recipeId, rating, body) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // recipe_review 테이블에 리뷰 삽입
    const [reviewResult] = await conn.query(
      "INSERT INTO recipe_review (user_id, recipe_id, rating, body) VALUES (?, ?, ?, ?)",
      [userId, recipeId, rating, body]
    );

    // recipe_rating 테이블에 평점 삽입 또는 업데이트
    await conn.query(
      `INSERT INTO recipe_rating (recipe_id, user_id, rating) 
      VALUES (?, ?, ?) 
      ON DUPLICATE KEY UPDATE rating = ?`,
      [recipeId, userId, rating, rating]
    );

    // 평점 통계 업데이트 (Recipe 테이블)
    await conn.query(
      `UPDATE recipe r
      SET r.average_rating = (
        SELECT AVG(rr.rating)
        FROM recipe_rating rr
        WHERE rr.recipe_id = r.id
      )
      WHERE r.id = ?`,
      [recipeId]
    );

    await conn.commit();
    return reviewResult.insertId;
  } catch (error) {
    await conn.rollback();
    console.error("Database error:", error);
    throw error;
  } finally {
    conn.release();
  }
};

//레시피 상세 리뷰 카드
export const getRecipeCardDB = async (recipeId, limit = 3) => {
  const [rows] = await db.query(
    `SELECT
        SUBSTRING_INDEX(r.body, '\n', 3) as body,
        r.rating,
        r.created_at,
        u.name as userName
      FROM recipe_review r
      JOIN User u ON r.user_id = u.id
      WHERE r.recipe_id = ?
      ORDER BY r.created_at DESC`,
    [recipeId]
  );
  return rows;
};
