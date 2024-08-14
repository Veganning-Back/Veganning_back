import fs from "fs";
//이미지 파일 읽어 바이너리로 전환  
export const readImageFile = (filePath) => {
return new Promise((resolve, reject) => {
   fs.readFile(filePath, (err, data) => {
      if (err) {
      reject(err);
      } else {
      resolve(data);
      }
   });
});
};
