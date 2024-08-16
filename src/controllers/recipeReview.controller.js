import { saveImageToDB } from "../models/image.model.js";
import { readImageFile } from "../../utils/fileHandler.js";
import {
  getRecipeReviewsDB,
  getRecipeRateDB,
  addReviewDB,
  getRecipeCardDB,
} from "../models/recipeReview.model.js";

//레시피의 리뷰 가져오기
export const getRecipeReviews = async (req, res) => {
try {
   const { recipeId } = req.params;
   if (!recipeId) {
      return res.status(400).json({ message: "레시피 ID가 필요합니다." });
   }

   const reviews = await getRecipeReviewsDB(recipeId);

   // // 이미지 데이터를 Base64 문자열로 변환
   // const reviewsWithImages = reviews.map((review) => {
   // if (review.image) {
   //    review.image = review.image.toString("base64");
   // }
   // return review;
   // });

   res.status(200).json({ reviews});
} catch (error) {
   console.error(error);
   res
      .status(500)
      .json({ message: "리뷰를 조회하는 중 오류가 발생했습니다." });
}
};

//레시피별 리뷰 평균 평점, 리뷰 총개수, 별점 별 개수 집계
export const getRecipeRate = async (req, res) => {
   try {
      const { recipeId } = req.params;
      if (!recipeId) {
         return res.status(400).json({ message: "레시피 ID가 필요합니다." });
      }
      const rate = await getRecipeRateDB(recipeId);      
      if (rate) {
        // 평균 평점을 소수점 한 자리까지 반올림
      rate.average_rating = Number(rate.average_rating).toFixed(1);
      res.status(200).json({ rate });
      }
   }
   catch (error) {
      console.error(error);
   }
   
}

//레시피 리뷰 작성 
export const addReview = async (req, res) => {
try {
const { recipeId } = req.params;
const { rating, body } = req.body;

//고정 user_id 사용
const userId = process.env.DEFAULT_USER_ID;

if (!recipeId || !userId || !rating || !body) {
   return res.status(400).json({ message: "모든 필드가 필요합니다." });
}

if (rating < 1 || rating > 5) {
   return res.status(400).json({ message: "평점은 1에서 5 사이여야 합니다." });
}

   const reviewId = await addReviewDB(userId, recipeId, rating, body);
   
// const updatedStats = await getRecipeRateDB(recipeId);

res.status(201).json({
   message: "리뷰가 성공적으로 작성되었습니다.",
   reviewId: reviewId
});
} catch (error) {
   console.error("Error in postReview:", error);
   res
      .status(500)
      .json({ message: "서버 오류가 발생했습니다.", error: error.message });
}
};

//레시피 상세 조회 하단 리뷰 카드 
export const getRecipeCard = async (req, res) => {
   try {
      const recipeId = parseInt(req.params.recipeId);

      if (isNaN(recipeId)) {
         return res
         .status(400)
         .json({ message: "유효하지 않은 레시피 ID입니다." });
      }

      const recipeReviews = await getRecipeCardDB(recipeId);

      if (recipeReviews.length === 0) {
         return res
         .status(404)
         .json({ message: "해당 레시피에 대한 리뷰를 찾을 수 없습니다." });
      }

      res.status(200).json({
         message: "레시피 리뷰 카드를 성공적으로 가져왔습니다.",
         data: recipeReviews,
      });
   } catch (error) {
      console.error("레시피 카드 조회 중 오류 발생:", error);
      res.status(500).json({ message: "서버 오류가 발생했습니다." });
   }
}