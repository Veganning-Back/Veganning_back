// models/user.dao.js

import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { getUserID, insertUserSql, getPreferToUserID } from "./user.sql.js";

// // User 데이터 삽입
// export const addUser = async (data) => {
//     try{
//         const conn = await pool.getConnection();
        
//         const [confirm] = await pool.query(confirmEmail, data.email);

//         if(confirm[0].isExistEmail){
//             conn.release();
//             return -1;
//         }

//         const result = await pool.query(insertUserSql, [data.email, data.name, data.gender, data.birth, data.addr, data.specAddr, data.phone]);

//         conn.release();
//         return result[0].insertId;
        
//     }catch (err) {
//         throw new BaseError(status.PARAMETER_IS_WRONG);
//     }
// }

// 사용자 정보 얻기
export const getUser = async (userId) => {
    try {
        const conn = await pool.getConnection();
        const [user] = await pool.query(getUserID, userId);

        console.log(user);

        if(user.length == 0){
            return -1;
        }

        conn.release();
        return user;
        
    } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}