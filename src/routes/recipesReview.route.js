import express from "express";
import { getRecipeReviews, getRecipeRate, addReview, getRecipeCard } from "../controllers/recipeReview.controller.js";

export const recipeReviewRouter = express.Router();

recipeReviewRouter.use((req, res, next) => {
  console.log(`Router incoming request: ${req.method} ${req.url}`);
  next();
});

//레시피별 리뷰 리스트(글) 조회
recipeReviewRouter.get("/:recipeId/reviews", getRecipeReviews);

//식단에 대한 평균 별점과 기타 점수 조회
recipeReviewRouter.get("/:recipeId/rate",getRecipeRate );

//레시피별 리뷰 작성 
recipeReviewRouter.post("/:recipeId/add", addReview);

//레시피 상세페이지 하단 리뷰 카드
recipeReviewRouter.get("/:recipeId/card", getRecipeCard);