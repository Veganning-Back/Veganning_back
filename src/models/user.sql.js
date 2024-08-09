// models/user.sql.js

export const insertUserSql = "INSERT INTO user (id, email, user_name) VALUES (?, ?, ?);";

export const getUserID = "SELECT * FROM user WHERE user_id = ?";

export const getUserSave_Rec = "SELECT * FROM recipe_savening WHERE user_id = ?";
export const getUserSave_Res = "SELECT * FROM store_savening WHERE user_id = ?";