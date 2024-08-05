import express from 'express';
import cors from 'cors';  // cors 모듈 import
import { homeRouter } from './src/routes/home.route.js';


const app = express();

// server setting - view, static, body-parser etc..
app.set('port', process.env.PORT || 3000);   // 서버 포트 지정
app.use(cors());                            // cors 방식 허용
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

//homeTab기능
app.use('/home', homeRouter);



app.use((req, res, next) => {
    const err = new BaseError(status.NOT_FOUND);
    next(err);
});

// 포트를 `app.get('port')`에서 가져옵니다.
app.listen(app.get('port'), () => {
    console.log(`Example app listening on port ${app.get('port')}`);
});
