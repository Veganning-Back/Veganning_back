//(3.1.1 / 3.1.2 / 3.1.3)
export const getUserData = () => `
    SELECT u.name, DATEDIFF(NOW(), u.start_vegan) AS d_plus_day
    FROM User u
    WHERE u.id = ?;
`;

//r.carbohydrate, r.sugar, r.protein, r.fat, r.user_id
export const getRecommendationQuery = (placeholders, ingredientCount) => `
    SELECT r.id, r.name, r.image 
    FROM Recipe r
    JOIN ingredients i ON r.id = i.recipe_id
    WHERE i.name IN (${placeholders})
    GROUP BY r.id
    HAVING COUNT(DISTINCT i.name) = ${ingredientCount};
`;

export const getRandomRecipe = () => `
    SELECT id, name, image FROM recipe
    ORDER BY RAND()
    LIMIT 1;
`;
//-------------------------------------------------------------------------

//3.1.4
export const getHotStoresQuery = ({ open, close }) => `
SELECT s.id, s.name, s.address, s.image, o.mon_open AS open, o.mon_close AS close, sr.avg, ss.save_count
FROM store s
JOIN open o ON s.id = o.store_id
JOIN store_rating sr ON s.id = sr.store_id
JOIN (
    SELECT store_id, COUNT(*) AS save_count
    FROM store_savning
    GROUP BY store_id
) ss ON s.id = ss.store_id
ORDER BY ss.save_count DESC
LIMIT 4;
`;

