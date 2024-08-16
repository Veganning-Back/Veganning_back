import path from "path";
import fs from "fs/promises";
//이미지 파일 -> 바이너리 

export const readImageFile = async(filePath) => {

   try {
      const data = await fs.readFile(filePath);
      return data;
   } catch (error) {
      console.error(`Error reading image file: ${filePath}`, error);
      throw error;
   }
   };
