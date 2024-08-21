// myPage.service.js

import { myPageResponseDTO } from "../dtos/myPage.response.dto.js";
import { pool } from "../../config/db.config.js";

export const getmyPageData = () => {
    return myPageResponseDTO("This is myPage! >.0");
}

export const getUserDataById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM user WHERE id = ?', [id]);
    return rows[0];
};