import path from "path";
import fs from "fs/promises";
//이미지 파일 ->base 64

export const readImageFile = async(filePath) => {

   try {
      const data = await fs.readFile(filePath);
      return data.toString("base64");
   } catch (error) {
      console.error("Error reading image file:", error);

      throw error;
   }
   };
