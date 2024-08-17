import express from "express";
import asyncHandler from "express-async-handler";
import {showHotStoreList, showStoreInfo, showStoreRate,
     addStoreReview, showStoreReviewList, savningStore, showStoreImageList } from "../controllers/store.controller.js";

export const storeRouter = express.Router({mergeParams: true});

//hot식당 리스트
//(3.4 / 3.4.2 / 3.4.3)
storeRouter.get('/hot', asyncHandler(showHotStoreList));


//식당 상세페이지
//(3.6.2 / 3.6.3 / 3.6.4 / 3.6.6 / 3.6.8 / 3.6.9)
storeRouter.get('/:storeId', asyncHandler(showStoreInfo));


//식당 리뷰 별점정보
//(3.7.2)
storeRouter.get("/rate/:storeId", asyncHandler(showStoreRate));


//식당리뷰등록
//(3.7.3)
storeRouter.post("/reviews/:a", asyncHandler(addStoreReview));  //엔드포인트 오류 해결해야함


//식당 리뷰 무한스크롤
//(3.6.10 / 3.7 / 3.7.6)
storeRouter.get('/:storeId/review-list', asyncHandler(showStoreReviewList));


//식당 세이브닝
//(3.9.6)
storeRouter.post("/savning/:aa", asyncHandler(savningStore));


//식당 사진리스트
//(3.8)
storeRouter.get("/image/:storeId", asyncHandler(showStoreImageList));