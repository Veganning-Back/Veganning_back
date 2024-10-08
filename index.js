import express from 'express';
import cors from 'cors';  // cors 모듈 import
import { homeRouter } from './src/routes/home.route.js';
import { storeRouter } from './src/routes/store.route.js';
import { recipeRouter } from "./src/routes/recipes.route.js";
import { recipeReviewRouter } from "./src/routes/recipesReview.route.js"
import dailyRecordRoutes from './src/routes/recordRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import { myPageRouter } from './src/routes/myPage.route.js';
import { authRouter } from './src/routes/auth.routes.js';

import dotenv from 'dotenv';

dotenv.config();

const app = express();

// server setting - view, static, body-parser etc..
app.set('port', process.env.PORT || 3000);   // 서버 포트 지정
app.use(cors());                            // cors 방식 허용
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

//homeTab기능
app.use('/home', homeRouter);

//STORE 관련기능
app.use('/stores', storeRouter);

//이하 레시피 --------------------------------------------------
app.use("/recipes", recipeRouter);

app.use("/recipes", recipeReviewRouter);

//이하 챌린지------------------------------------------------
// 사용자 관련 API 라우트 등록
app.use('/users', userRoutes);

// 일일 기록 관련 API 라우트 등록
app.use('/daily-record', dailyRecordRoutes);

//이하 마이탭 ------------------------------------------------
// router setting
app.use('/myPage', myPageRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
    console.log('404 Error - Page not found');
    res.status(404).send('Page not found');
});

// 포트를 `app.get('port')`에서 가져옵니다.
app.listen(app.get('port'), () => {
    console.log(`Example app listening on port ${app.get('port')}`);
});
