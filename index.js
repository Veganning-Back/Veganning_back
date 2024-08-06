import express from 'express'          // ES6
import cors from 'cors';  // cors 모듈 import
import { myPageRouter } from './src/routes/myPage.route.js';
import db from './config/db.config.js';

const app = express();

// server setting - view, static, body-parser etc..
app.set('port', process.env.PORT || 3000);   // 서버 포트 지정
app.use(cors());                            // cors 방식 허용
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석


const myLogger = (req, res, next) => {
    console.log("LOGGED");
    next();
}

app.use(myLogger);

app.get('/', (req, res) => {
    console.log("/");
    res.send('Hello!');
});

app.use(express.json());

// router setting
app.use('/myPage', myPageRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// // 포트를 `app.get('port')`에서 가져옵니다.
// app.listen(app.get('port'), () => {
//     console.log(`Example app listening on port ${app.get('port')}`);
// });