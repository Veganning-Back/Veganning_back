
import express from "express";
import {
  AddRecipe,
  getRecipesByType,getRecipesById,getMyRecipes,addSavning,deleteSavning,//searchRecipes
} from "../controllers/recipe.controller.js";
import { modifyRecipe } from "../controllers/recipeModify.controller.js"


export const recipeRouter = express.Router();

recipeRouter.use((req, res, next) => {
  console.log(`Router incoming request: ${req.method} ${req.url}`);
  next();
});

//레시피 진입 화면 (레시피 리스트)
recipeRouter.get("/", getRecipesByType);

//레시피 공모하기
recipeRouter.post("/", AddRecipe); 

//레시피 상세 조회
recipeRouter.get("/:recipeId", getRecipesById);

//내 공모 리스트
recipeRouter.get("/:userId/myRecipes", getMyRecipes);

//레시피 세이브닝
recipeRouter.post("/:recipeId/savning", addSavning);

//레시피 세이브닝 취소
recipeRouter.delete("/:recipeId/savning", deleteSavning);

//내 공모 레시피 수정하기
recipeRouter.patch("/:recipeId/modify", modifyRecipe);

//레시피 검색하기
//recipeRouter.get("/search", searchRecipes);