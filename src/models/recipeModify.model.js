import db from "../../congfig/db.config.js";


export const modifyRecipeDB = async (
   recipeId,
   recipeData,
   ingredients,
   cookingSteps
   ) => {
   const conn = await db.getConnection();

   try {
      await conn.beginTransaction();

      // 기존 레시피 데이터 조회
      const [existingRecipe] = await conn.query(
         "SELECT * FROM recipe WHERE id = ?",
         [recipeId]
      );
      if (existingRecipe.length === 0) {
         throw new Error("Recipe not found");
      }

      // 기본 레시피 정보 업데이트
      if (recipeData) {
         const updatedRecipeData = { ...existingRecipe[0], ...recipeData };
         const {
         name,
         description,
         image,
         type,
         carbohydrate,
         calorie,
         protein,
         fat,
         } = updatedRecipeData;
         await conn.query(
         "UPDATE recipe SET name = ?, description = ?, image = ?, type = ?, carbohydrate = ?, calorie = ?, protein = ?, fat = ? WHERE id = ?",
         [
            name,
            description,
            image,
            type,
            carbohydrate,
            calorie,
            protein,
            fat,
            recipeId,
         ]
         );
      }

      // 재료 업데이트
      if (ingredients !== undefined) {
         await conn.query("DELETE FROM ingredients WHERE recipe_id = ?", [
         recipeId,
         ]);
         if (ingredients && ingredients.length > 0) {
         const ingredientValues = ingredients.map((ing) => [
            recipeId,
            ing.name,
            ing.quantity,
         ]);
         await conn.query(
            "INSERT INTO ingredients (recipe_id, name, quantity) VALUES ?",
            [ingredientValues]
         );
         }
      }

      // 요리 단계 업데이트
      if (cookingSteps !== undefined) {
         await conn.query("DELETE FROM cookingStep WHERE recipe_id = ?", [
         recipeId,
         ]);
         if (cookingSteps && cookingSteps.length > 0) {
         const stepValues = cookingSteps.map((step) => [
            recipeId,
            step.step_number,
            step.description,
         ]);
         await conn.query(
            "INSERT INTO cookingStep (recipe_id, step_number, description) VALUES ?",
            [stepValues]
         );
         }
      }

      await conn.commit();

      return { message: "수정이 완료되었습니다." };
   } catch (error) {
      await conn.rollback();
      throw error;
   } finally {
      conn.release();
   }
   };
