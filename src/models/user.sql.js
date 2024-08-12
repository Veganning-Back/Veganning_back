// models/user.sql.js


export const getUserID = "SELECT * FROM user WHERE user_id = ?";

export const getUserSave_Rec = "SELECT * FROM recipe_savening WHERE user_id = ?";
export const getUserSave_Res = "SELECT * FROM store_savening WHERE user_id = ?";
export const deleteSavedRecipeQuery = `DELETE FROM recipe_savening WHERE user_id = ? AND recipe_id = ?`;
export const deleteSavedRestaurantQuery = `DELETE FROM store_savening WHERE user_id = ? AND store_id = ?`;

export const insertUserSql = `
    INSERT INTO user (email, password, name, start_vegan, signupDate)
    VALUES (?, ?, ?, ?, CURRENT_DATE);
`;

export const getUserByEmail = 'SELECT * FROM user WHERE email = ?';

export const getUserRecipesQuery = 'SELECT * FROM recipe WHERE user_id = ?';
