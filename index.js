// index.js
import dotenv from 'dotenv';

dotenv.config();

import express from "express";
import { recipeRouter } from "./src/routes/recipes.route.js";
import { recipeReviewRouter } from "./src/routes/recipesReview.route.js"
import dbConfig from "./config/db.config.js";

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
app.use(express.json()); // JSON 파싱 미들웨어


// 디버깅 로그 추가
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// 라우터 설정
app.use("/recipes", recipeRouter);

app.use("/recipes", recipeReviewRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
