import express from 'express';
import dotenv from 'dotenv';
import dailyRecordRoutes from './src/routes/recordRoutes.js';
import userRoutes from './src/routes/userRoutes.js';

const app = express();

app.use(express.json());  
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

// 사용자 관련 API 라우트 등록
app.use('/users', userRoutes);

// 일일 기록 관련 API 라우트 등록
app.use('/daily-record', dailyRecordRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
