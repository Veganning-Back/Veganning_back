import path from "path";
import fs from "fs/promises";

const IMAGE_BASE_PATH = "/path/to/image/directory";

export const readImageFile = async (filename) => {
  const fullPath = path.join(IMAGE_BASE_PATH, filename);
  try {
    const data = await fs.readFile(fullPath);
    return data;
  } catch (error) {
    console.error(`Error reading image file: ${fullPath}`, error);
    throw error;
  }
};
