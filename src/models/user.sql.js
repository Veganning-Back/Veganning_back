// models/user.sql.js

export const insertUserSql = "INSERT INTO user (id, email, user_name) VALUES (?, ?, ?);";

export const getUserID = "SELECT * FROM user WHERE user_id = ?";

