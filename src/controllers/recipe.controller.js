import { saveImageToDB } from "../models/image.model.js";
import { readImageFile } from "../../utils/fileHandler.js";
import {addRecipeToDB,addIngredientToDB ,addCookingStepToDB,addSavningDB,deleteSavningDB
} from "../models/recipe.model.js";
import { getRecipesByIdDB,getRecipesByTypeDB,getRecipesByUserIdFromDB,searchRecipesDB
} from "../models/recipe.model.js";

// AddRecipe 함수 정의
export const AddRecipe = async (req, res) => {
try {
   const {
      name,
      description,
      image,
      type,
      carbohydrate,
      calorie,
      protein,
      fat,
      ingredients,
      cookingSteps,
   } = req.body;

   // 데이터 검증
   if (!name || !description || !ingredients || !cookingSteps) {
      return res.status(400).json({ message: "Required fields are missing." });
   }
   //고정 user_id 사용
   const userId = process.env.DEFAULT_USER_ID;

   // 레시피 추가
   const newRecipeId = await addRecipeToDB({
      name,
      description,
      image:null,
      type,
      carbohydrate,
      calorie,
      protein,
      fat,
      user_id: userId, // 예: 인증된 사용자 ID 사용
   });

   //이미지 저장
   if (image) {
      const imageData = await readImageFile(image);
      await saveImageToDB(imageData, "Recipe", newRecipeId);
   }

   // 재료 추가
   for (const ingredient of ingredients) {
      await addIngredientToDB({
      name: ingredient.name,
      quantity: ingredient.quantity,
      recipe_id: newRecipeId,
      });
   }

   // 요리 순서 추가
   for (const step of cookingSteps) {
      const stepId = await addCookingStepToDB({
      step_number: step.step_number,
      description: step.description,
      recipe_id: newRecipeId,
      });
   

   //요리 단계별 이미지 저장
   if (step.image) {
      const stepImageData = await readImageFile(step.image);
      await saveImageToDB(stepImageData, 'cookingStep', stepId);
   }
   }
   res
      .status(201)
      .json({ message: "Recipe added successfully!", recipeId: newRecipeId });
} catch (error) {
   console.error("Error in addRecipeToDB:", error);
   throw error;
}
};

//타입별로 레시피 목록 가져오기
export const getRecipesByType = async (req, res) => {
   try {
     const { type, fromrecruit } = req.query; // 쿼리 파라미터에서 type을 추출
     const recipes = await getRecipesByTypeDB(type,fromrecruit ==='true'); // 데이터베이스에서 해당 타입의 레시피를 가져옴
     res.status(200).json(recipes);
   } catch (error) {
      console.error("Error fetching recipes by type:", error);
      res.status(500).json({ message: "Error fetching recipes by type", error });
   }
};

//레시피id별로 레시피 상세조회
export const getRecipesById = async (req, res) => {
   const { recipeId } = req.params;

   try {
   const recipe = await getRecipesByIdDB(recipeId);

   if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
   }

   // // 이미지 데이터를 Base64 문자열로 변환
   // if (recipe.image) {
   //    recipe.image = recipe.image.toString("base64");
   // }

   // recipe.cookingSteps = recipe.cookingSteps.map((step) => {
   //    if (step.image) {
   //       step.image = step.image.toString("base64");
   //    }
   //    return step;
   // });

   res.json(recipe);
   } catch (error) {
   console.error("Error in getRecipesById:", error);
   res.status(500).json({ message: "Internal server error" });
   }
}

//내가 공모한 레시피
export const getMyRecipes = async (req, res) => {
   const userId = req.params.userId;

   if (!userId) {
   return res.status(404).json({ message: "User not found" });
   }

   try {
   const recipes = await getRecipesByUserIdFromDB(userId);

   if (!recipes || recipes.length === 0) {
      return res
         .status(404)
         .json({ message: "No recipes found for this user" });
   }
   res.json(recipes);
   } catch (error) {
   console.error("Error in getRecipesByUserId:", error);
   res.status(500).json({ message: "Internal server error" });
   }

}

//세이브닝 추가 
export const addSavning = async (req, res) => {
   try {
      const { recipeId } = req.params;
      const userId = process.env.DEFAULT_USER_ID; // 인증된 사용자의 ID를 가져온다고 가정

      const newSavning = await addSavningDB(userId, recipeId);
      console.log("New Savning:", newSavning);

   res.status(201).json({ message: 'Recipe bookmarked successfully',newSavning });
} catch (error) {
   res.status(500).json({ message: "Error bookmarking recipe", error }
   );
}
};

// 레시피 세이브닝 취소
export const deleteSavning = async (req, res) => {
   try {
      const { recipeId } = req.params;
      const userId = process.env.DEFAULT_USER_ID; // 인증된 사용자의 ID를 가져온다고 가정


      const deleteSavning = await deleteSavningDB(userId, recipeId);

      if (deleteSavning) {
         res.status(200).json({ message: "Savning deleted successfully" });
      } else {
         res.status(404).json({ message: "Savning not found" });
      }
   }
   catch (error) {
      res.status(500).json({ message: 'Error unbookmarking recipe', error });
   }
};

//레시피 검색
export const searchRecipes = async (req, res) => {
try {
  // 쿼리 파라미터에서 name 값을 가져옴
   const { name } = req.query;
   
  if (!name) {
    return res.status(400).json({ error: "검색어를 입력해주세요." });
  }

   const recipes = await searchRecipesDB(name);
   if (recipes.length === 0) {
      return res.status(404).json({ message: "검색 결과가 없습니다." });
   }


  // 검색 결과를 클라이언트에 반환
  return res.status(200).json(recipes);
} catch (error) {
   return res.status(500).json({ error: "서버 오류가 발생했습니다." });
}
};


