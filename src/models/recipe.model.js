import db from "../../config/db.config.js"; 
import { getImageFromDB } from "./image.model.js";

// 레시피 추가
export const addRecipeToDB = async (recipe) => {
const {
   name,
   description,
   image,
   type,
   carbohydrate,
   calorie,
   protein,
   fat,
   user_id,
} = recipe;
const [result] = await db.query(
   "INSERT INTO recipe (name, description, type, carbohydrate, calorie, protein, fat, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
   [name, description, type, carbohydrate, calorie, protein, fat, user_id]
   );
   const recipeId = result.insertId;

   //레시피 생성후 이미지 별도 처리
   if (image) {
      const imageData = await readImageFile(image);
      await saveImageToDB(imageData, "recipe", recipeId);
   }

return recipeId;


};

// 재료 추가
export const addIngredientToDB = async (ingredient) => {
const { name, quantity, recipe_id } = ingredient;
await db.query(
   "INSERT INTO ingredients (name, quantity, recipe_id) VALUES (?, ?, ?)",
   [name, quantity, recipe_id]
);
};


// 요리 순서 추가
export const addCookingStepToDB = async (step) => {
const { step_number, description, recipe_id,image } = step;
const [result] =await db.query(
   "INSERT INTO cookingStep (step_number, description, recipe_id) VALUES (?, ?, ?)",
   [step_number, description, recipe_id]
   );
   const stepId = result.insertId;

   if (image) {
     const imageData = await readImageFile(image);
     await saveImageToDB(imageData, "cookingStep", stepId);
   }

   return stepId;
};

//타입별 레시피 이름,순서2개,이미지 가져오기
export const getRecipesByTypeDB = async (type,fromrecruit = false) => {
   try {
     const query = `
      SELECT 
         r.id,
      r.name,
      r.image,
      GROUP_CONCAT(
         CONCAT(cs.step_number, ':', cs.description)
         ORDER BY cs.step_number ASC
         SEPARATOR '||'
         ) AS cooking_steps
      FROM 
         recipe r
      LEFT JOIN 
         cookingStep cs ON r.id = cs.recipe_id
      WHERE 
         r.type = ?
         ${fromrecruit ? "AND r.id >= 9" : ""}
      GROUP BY
         r.id
      ORDER BY 
         r.id;
      `;

      const [rows] = await db.query(query, [type]);

      const recipes = await Promise.all(
        rows.map(async (row) => {
          const image = await getImageFromDB("recipe", row.id);
          const cookingSteps = row.cooking_steps
            ? row.cooking_steps.split("||").map((step) => {
                const [step_number, description] = step.split(":");
                return { step_number: parseInt(step_number), description };
              })
            : [];

          return {
            id: row.id,
            name: row.name,
            image: image ? image.toString("base64") : null,
            cookingSteps: cookingSteps.slice(0, 2), // 처음 2개의 요리 단계만 포함
          };
        })
      );

      console.log("Processed recipes:", recipes);
      return recipes;

   } catch (error) {
      console.error("Error in getRecipesFromDB:", error);
      throw error;
   }
};

//recipe_id에 따른 레시피 상세 조회
export const getRecipesByIdDB = async (recipeId) => {
try {
   const [recipeRows] = await db.query(
     `
      SELECT id, name, description, type, carbohydrate, calorie, protein, fat, average_rating, image
      FROM recipe
      WHERE id = ?
    `,
     [recipeId]
   );

   if (recipeRows.length === 0) {
     return null;
   }

   const recipe = recipeRows[0];

   const [ingredientRows] = await db.query(
     `
      SELECT name, quantity
      FROM ingredients
      WHERE recipe_id = ?
    `,
     [recipeId]
   );

   const [stepRows] = await db.query(
     `
      SELECT id, step_number, description, image
      FROM cookingStep
      WHERE recipe_id = ?
      ORDER BY step_number
    `,
     [recipeId]
   );

   recipe.image = recipe.image ? recipe.image.toString("base64") : null;
   recipe.ingredients = ingredientRows;
   recipe.cookingSteps = stepRows.map((step) => ({
     ...step,
     image: step.image ? step.image.toString("base64") : null,
   }));

   return recipe;
} catch (error) {
   console.error("Error in getRecipeDetailsFromDB:", error);
   throw error;
}
};

//사용자 id로 레시피 가져오기(내가 공모한 레시피 조회)
export const getRecipesByUserIdFromDB = async (userId) => {
try {
   const query = `
            SELECT 
               r.id,
               r.name,
               r.image,
               cs.step_number,
               cs.description
            FROM 
               recipe r
            JOIN 
               (SELECT recipe_id, step_number, description, image 
               FROM cookingStep 
               WHERE step_number <= 2) as cs
            ON 
               r.id = cs.recipe_id
            WHERE 
               r.user_id = ?
            ORDER BY 
               r.id, cs.step_number;
      `;

   const [rows] = await db.query(query, [userId]);

   // 반환값 구조
   const recipes = {};
   rows.forEach((row) => {
      if (!recipes[row.id]) {
      recipes[row.id] = {
         id: row.id,
         name: row.name,
         image: row.image ? row.image.toString("base64") : null,
         step_number_1: null,
         description_1: null,
         step_number_2: null,
         description_2: null,
      };
      }
      if (row.step_number === 1) {
      recipes[row.id].step_number_1 = row.step_number;
      recipes[row.id].description_1 = row.description;
      }
      if (row.step_number === 2) {
      recipes[row.id].step_number_2 = row.step_number;
      recipes[row.id].description_2 = row.description;
      }
   });

   // 객체를 배열로 변환하여 반환
   return Object.values(recipes);
} catch (error) {
   console.error("Error in getRecipesByUserIdFromDB:", error);
   throw error;
}
};

//레시피 세이브닝 추가
export const addSavningDB = async (userId, recipeId) => {
   try {
      const [result] = await db.query(
        "INSERT INTO recipe_savning (user_id, recipe_id) VALUES (?, ?)",
        [userId, recipeId]
      );
   
      return {
         id: result.insertId
      };
   
   }
   catch (error) {
      console.error("Error in createSavningDB:", error);
      throw error;
   }
};

//세이브닝 삭제 
export const deleteSavningDB = async (userId, recipeId) => {
   try {
      const [result] = await db.query(
         "DELETE FROM recipe_savning WHERE user_id = ? AND recipe_id = ?",
         [userId, recipeId]
      );
      return result.affectedRows > 0;
   }
   catch (error) {
      console.error("Error in deleteSavningDB:", error);
      throw error;
   }
};

//검색 기능
export const searchRecipesDB = async (searchTerm) => {
   try {
   const query = `
      SELECT r.id, r.name, r.description, r.image, 
            GROUP_CONCAT(
               DISTINCT CONCAT(cs.step_number, ':', cs.description)
               ORDER BY cs.step_number ASC
               SEPARATOR '||'
               ) AS cooking_steps
      FROM recipe r
      LEFT JOIN (
        SELECT recipe_id, step_number, description
        FROM cookingStep
        WHERE step_number <= 2  
      ) cs ON r.id = cs.recipe_id
      WHERE r.name LIKE ?
      GROUP BY r.id
      LIMIT 10
   `;
   const [rows] = await db.execute(query, [`%${searchTerm}%`]);

    const recipes = await Promise.all(
      rows.map(async (row) => {
        const image = await getImageFromDB("recipe", row.id);
        return {
          ...row,
          description: row.description.split(".")[0] + ".",
          cooking_steps: row.cooking_steps
            ? row.cooking_steps.split("||").map((step) => {
                const [stepNumber, description] = step.split(":");
                return { step_number: parseInt(stepNumber), description };
              })
            : [],
          image: image ? image.toString("base64") : null,
        };
      })
    );
      return recipes;
   } catch (error) {
   console.error("Error searching recipes:", error);
   throw error;
   }
}