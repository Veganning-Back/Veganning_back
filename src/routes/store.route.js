import express from "express";
import asyncHandler from "express-async-handler";
import {showHotStoreList} from "../controllers/store.controller.js";

export const storeRouter = express.Router({mergeParams: true});

//(3.4 / 3.4.2 / 3.4.3)
storeRouter.get('/hot/:cursorId', asyncHandler(showHotStoreList));