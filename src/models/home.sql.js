//(3.1.1 / 3.1.2 / 3.1.3)
export const getUserData = () => `
    SELECT u.name, DATEDIFF(NOW(), u.start_vegan) AS d_plus_day
    FROM user u
    WHERE u.id = ?;
`;

//필터 거친 추천레시피 1개 리턴
// 필터 거친 추천 레시피 5개 리턴
export const getRecommendationQuery = (placeholders, ingredientCount) => `
    SELECT r.id, r.name, r.image 
    FROM recipe r
    JOIN ingredients i ON r.id = i.recipe_id
    WHERE i.name IN (${placeholders})
    GROUP BY r.id
    HAVING COUNT(DISTINCT i.name) = ${ingredientCount}
    LIMIT 5;
`;

// 랜덤 레시피 5개 리턴
export const getRandomRecipe = () => `
    SELECT id, name, image FROM recipe
    ORDER BY RAND()
    LIMIT 5; 
`;

//-------------------------------------------------------------------------

//3.1.4
export const getHotStoresQuery = ({ open, close }) => `
SELECT s.id, s.name, s.address, s.image, o.mon_open AS open, o.mon_close AS close, sr.avg, COALESCE(ss.save_count, 0) AS save_count
FROM store s
JOIN open o ON s.id = o.store_id
JOIN store_rating sr ON s.id = sr.store_id
LEFT JOIN (
    SELECT store_id, COUNT(*) AS save_count
    FROM store_savning
    GROUP BY store_id
) ss ON s.id = ss.store_id
ORDER BY ss.save_count DESC
LIMIT 4;

`;



export const getHotRecipeQuery = () => {
    return `
        SELECT r.id, r.name, r.type, s1.description as sequence_1, s2.description as sequence_2, r.image
        FROM recipe r
        JOIN cookingStep s1 ON r.id = s1.recipe_id AND s1.step_number = 1
        JOIN cookingStep s2 ON r.id = s2.recipe_id AND s2.step_number = 2
        ORDER BY RAND()
        LIMIT 1;
    `;
};


