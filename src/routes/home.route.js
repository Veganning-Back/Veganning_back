import express from "express";
import asyncHandler from "express-async-handler";
import { showHotStores } from "../controllers/home.controller.js";

export const homeRouter = express.Router({mergeParams: true});

homeRouter.get('/weekly/store', asyncHandler(showHotStores)); //hot식당 4개

