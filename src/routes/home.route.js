import express from "express";
import asyncHandler from "express-async-handler";
import { showHotStores, recommendRecipe, showHotRecipe } from "../controllers/home.controller.js";

export const homeRouter = express.Router({mergeParams: true});


//(3.1.1 / 3.1.2 / 3.1.3)
homeRouter.get('/:userId/recommend', asyncHandler(recommendRecipe));

//(3.1.4)hot식당 4개
homeRouter.get('/weekly/store', asyncHandler(showHotStores)); 

//(3.1.6)hot 레시피 1개
homeRouter.get('/hot/recipes', asyncHandler(showHotRecipe));