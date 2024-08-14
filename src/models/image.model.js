import db from "../../congfig/db.config.js";
export const saveImageToDB = async (imageData, tableName, id) => {
   try {
      const query = `UPDATE ?? SET image = ? WHERE id = ?`;
      await db.query(query, [tableName, imageData, id]);
      console.log("Image saved successfully!");
   } catch (error) {
      console.error("Error saving image to DB:", error);
      throw error;
   }
};



// 특정 테이블의 이미지를 가져오는 함수
export const getImageFromDB = async (tableName, id) => {
   try {
      const query = `SELECT image FROM ?? WHERE id = ?`;
      const [rows] = await db.query(query, [tableName, id]);
      if (rows.length === 0) {
         throw new Error("Record not found");
      }
      return rows[0].image;
   } catch (error) {
      console.error("Error getting image from DB:", error);
      throw error;
   }
};


